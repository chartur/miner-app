import {Injectable} from "@angular/core";
import {Boost} from "../interface/models/boost";
import {ComponentStore} from "@ngrx/component-store";
import {catchError, EMPTY, filter, Observable, Subject, switchMap, tap} from "rxjs";
import {BoostLevels} from "../interface/enum/boost-levels";
import {WalletStore} from "./wallet.store";
import {BoostService} from "../services/boost.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {InvoiceDto} from "../interface/dto/invoice.dto";
import {TranslateService} from "@ngx-translate/core";

interface BoostState {
  loading: boolean,
  error: unknown,
  boost?: Boost,
  boostInvoice?: InvoiceDto,
  purchasesBoosts?: Boost[],
  starInvoiceLink?: string,
}

const initialState: BoostState = {
  loading: false,
  error: undefined,
  boost: undefined,
  boostInvoice: undefined,
  purchasesBoosts: [],
  starInvoiceLink: undefined,
}

@Injectable({
  providedIn: 'root'
})
export class BoostStore extends ComponentStore<BoostState>{
  public readonly boost$: Observable<Boost | undefined> = this.select((state) => state.boost);
  public readonly loading$: Observable<boolean> = this.select((state) => state.loading);
  public readonly invoice$: Observable<InvoiceDto | undefined> = this.select((state) => state.boostInvoice);
  public readonly getPurchasesBoosts$: Observable<Boost[]> = this.select(state => state?.purchasesBoosts || []);
  public readonly starInvoiceLink$: Observable<string | undefined> = this.select(state => state.starInvoiceLink);

  private _successfullyActivated: Subject<void> = new Subject<void>();
  public successfullyActivated$: Observable<void> = this._successfullyActivated.asObservable();

  public readonly setLoadingState = this.updater((state, loading: boolean) => ({
    ...state,
    loading,
  }));
  public readonly setBoostSuccess = this.updater((state, payload: Boost | undefined) => ({
    ...state,
    boost: payload,
    error: undefined,
    loading: false,
  }));
  public readonly setBoostFailure = this.updater((state, error: unknown) => ({
    ...state,
    boost: undefined,
    loading: false,
    error: error,
  }));
  public readonly removeInvoice = this.updater((state) => ({
    ...state,
    boostInvoice: undefined
  }));
  public readonly setInvoiceSuccess = this.updater((state, payload: InvoiceDto) => ({
    ...state,
    loading: false,
    error: undefined,
    boostInvoice: payload
  }));
  public readonly setInvoiceFailure = this.updater((state, error: unknown) => ({
    ...state,
    boostInvoice: undefined,
    loading: false,
    error: error,
  }));
  public readonly setPurchasesBoosts = this.updater((state, payload: Boost[] | undefined) => {
    return ({
      ...state,
      purchasesBoosts: payload,
      error: undefined,
      loading: false,
    })
  })
  public setStarInvoiceLinkSuccess = this.updater((state, payload: string | undefined) => ({
    ...state,
    error: undefined,
    loading: false,
    starInvoiceLink: payload
  }));
  public setStarInvoiceLinkFailure = this.updater((state, error: unknown) => ({
    ...state,
    error,
    loading: false,
    starInvoiceLink: undefined
  }));

  public readonly getInvoice = this.effect((body$: Observable<BoostLevels>) => {
    return body$.pipe(
      tap(() => this.removeInvoice()),
      switchMap((type) => this.walletStore.tgWallet$.pipe(
        filter(tgWallet => !!tgWallet),
        switchMap((tgWallet) => this.boostService.getInvoice(type).pipe(
          tap({
            next: (boost) => {
              this.setInvoiceSuccess(boost);
            },
            error: (err) => {
              this.setInvoiceFailure(err);
              this.matSnackBar.open(this.translateService.instant('errors.max_invoice_created'));
            }
          }),
          catchError(() => EMPTY)
        ))
      ))
    )
  });

  public readonly getClaimNotificationInvoiceLink = this.effect((body$: Observable<void>) => {
    return body$.pipe(
      tap(() => this.setLoadingState(true)),
      switchMap(() => this.boostService.getClaimNotificationInvoiceLink().pipe(
        tap({
          next: (response) => {
            this.setStarInvoiceLinkSuccess(response.link);
          },
          error: (err) => {
            this.setStarInvoiceLinkFailure(err);
          }
        }),
        catchError(() => EMPTY)
      ))
    )
  })

  constructor(
    private walletStore: WalletStore,
    private boostService: BoostService,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService
  ) {
    super(initialState);
  }
}
