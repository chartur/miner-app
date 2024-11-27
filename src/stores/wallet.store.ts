import {ComponentStore, OnStoreInit} from "@ngrx/component-store";
import {Wallet} from "../interface/models/wallet";
import {catchError, EMPTY, filter, map, Observable, Subject, switchMap, take, tap, zip} from "rxjs";
import {StorageService} from "../services/storage.service";
import {Injectable} from "@angular/core";
import moment from "moment";
import {WalletService} from "../services/wallet.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpFailureActionTypes} from "../interface/enum/http-failure-action-types";
import {ConfigStore} from "./config.store";
import {Wallet as TgWallet} from "@tonconnect/sdk";
import {Locales, THEME, TonConnectUI} from "@tonconnect/ui";
import {environment} from "../environments/environment";
import {TranslateService} from "@ngx-translate/core";
import {TonConnectEventDispatcher} from "../util/ton-connect-event-dispatcher";
import {InvoiceDto} from "../interface/dto/invoice.dto";

interface WalletState {
  wallet?: Wallet,
  loading: boolean,
  error: unknown,
  tgWallet: TgWallet | null,
  isTgWalletConnected: boolean,
}

const initialState: WalletState = {
  wallet: undefined,
  error: undefined,
  loading: true,
  tgWallet: null,
  isTgWalletConnected: false,
}

@Injectable({
  providedIn: "root"
})
export class WalletStore extends ComponentStore<WalletState> implements OnStoreInit {

  public readonly wallet$: Observable<Wallet | undefined> = this.select((state) => state.wallet);
  public readonly loading$: Observable<boolean> = this.select((state) => state.loading);
  public readonly error$: Observable<unknown> = this.select((state) => state.error);
  public readonly isClaimAvailable$: Observable<boolean> = this.select(state => state.wallet?.lastClaimDateTime)
    .pipe(
      switchMap((date) => this.configStore.periodWithSeconds$.pipe(
        take(1),
        map(periodWithSeconds => !!date && moment().diff(date, 'seconds') >= periodWithSeconds)
      )),
    );
  public readonly tgWallet$: Observable<TgWallet | null> = this.select((state) => state.tgWallet);
  public readonly isTgWalletConnected$: Observable<boolean> = this.select((state) => state.isTgWalletConnected);

  /** Other subscriptions */
  private _needToShowSubscribeModal = new Subject<void>()
  private _successfullyClaimed: Subject<void> = new Subject<void>()
  public needToShowSubscribeModal$: Observable<void> = this._needToShowSubscribeModal.asObservable();
  public successfullyClaimed$: Observable<void> = this._successfullyClaimed.asObservable();

  private _connector?: TonConnectUI;

  private readonly setLoadingState = this.updater((state, loading: boolean) => ({
    ...state,
    loading
  }));
  private readonly setWalletFailure = this.updater((state, error: unknown) => ({
    ...state,
    loading: false,
    error: error
  }));
  private readonly setWalletSuccess = this.updater((state, payload?: Wallet) => ({
    ...state,
    wallet: payload,
    error: undefined,
    loading: false,
  }));
  private readonly setTgWalletSuccess = this.updater((state, payload: TgWallet | null) => ({
    ...state,
    tgWallet: payload,
    isTgWalletConnected: payload !== null
  }));
  public readonly setTibcoins = this.updater((state, payload: string) => ({
    ...state,
    wallet: state.wallet ?
      {
        ...state.wallet,
        tibCoins: payload
      }
      : undefined
  }));

  public readonly setWalletDetails = this.effect((body$: Observable<Wallet | undefined>) => {
    return body$.pipe(
      tap((data) => {
        this.setWalletSuccess(data);
      })
    )
  });


  public readonly claim = this.effect((body$: Observable<void>) => {
    return body$.pipe(
      switchMap(() => zip([
        this.wallet$.pipe(
          take(1)
        ),
        this.configStore.periodWithSeconds$.pipe(
          take(1)
        ),
      ])),
      filter(([wallet, periodWithSeconds]) => !wallet?.lastClaimDateTime || moment().diff(wallet.lastClaimDateTime, 'seconds') >= periodWithSeconds),
      tap(() => this.setLoadingState(true)),
      switchMap(() => this.walletService.claim().pipe(
        tap({
          next: (wallet) => {
            this.setWalletSuccess(wallet);
            this.matSnackBar.open('You have successfully claimed your profit')
            this._successfullyClaimed.next();
          },
          error: (e) => {
            this.setWalletFailure(e);
            if (e.error.action) {
              switch (e.error.action as HttpFailureActionTypes) {
                case HttpFailureActionTypes.CLAIM_BEFORE_EXPECTED_TIME:
                  this.matSnackBar.open(e.error.message)
                  break;
                case HttpFailureActionTypes.NEED_TO_SUBSCRIBE_CHANNEL:
                  this._needToShowSubscribeModal.next();
                  break;
              }
            }
          }
        }),
        catchError(() => EMPTY)
      ))
    )
  });

  constructor(
    private configStore: ConfigStore,
    private storageService: StorageService,
    private walletService: WalletService,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService
  ) {
    super(initialState);
  }

  ngrxOnStoreInit() {
    this.initializeTonWallet();
  }

  private async initializeTonWallet(): Promise<void> {
    const eventDispatcher = new TonConnectEventDispatcher();
    this._connector = new TonConnectUI({
      manifestUrl: `${environment.appUrl}/assets/tonconnect-manifest.json`,
      language: this.translateService.currentLang as Locales,
      eventDispatcher: eventDispatcher,
      uiPreferences: {
        theme: THEME.DARK,
      }
    });

    this._connector.onStatusChange(
      (wallet) => {
        this.setTgWalletSuccess(wallet);
      },
      (err) => {
        this.matSnackBar.open(err.message);
      }
    );

    setTimeout(() => {
      if (this._connector?.connected) {
        this.setTgWalletSuccess(this._connector?.wallet)
      }
    })
  }

  public async connectWallet(): Promise<void> {
    if (!this._connector?.connected) {
      this._connector?.openModal();
    }
  }

  public async disconnectWallet(): Promise<void> {
    if (this._connector?.connected) {
      return this._connector?.disconnect()
    }
  }

  public async pay(invoiceDto: InvoiceDto): Promise<string | undefined> {
    try {
      const result = await this._connector?.sendTransaction({
        validUntil: moment().add(2, 'minutes').valueOf(),
        messages: [invoiceDto]
      });
      this.matSnackBar.open(this.translateService.instant('payment.boost_activation_success'))
      return result?.boc;
    } catch (e) {
      console.log(e, "PAYMENT_ERROR");
      this.matSnackBar.open((e as any).message);
      return Promise.reject(e);
    }
  }
}
