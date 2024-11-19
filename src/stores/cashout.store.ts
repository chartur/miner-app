import {Injectable} from "@angular/core";
import {Currencies} from "../interface/enum/currencies.";
import {CurrencyStore} from "../interface/other/currency-store";
import {catchError, EMPTY, map, Observable, of, retry, switchMap, takeUntil, tap, throwError} from "rxjs";
import {ComponentStore, OnStoreInit} from "@ngrx/component-store";
import {CashoutService} from "../services/cashout.service";
import {GetCurrencyRateDtoResponse} from "../interface/dto/get-currency-rate.dto.response";
import numeral from "numeral"
import {WalletStore} from "./wallet.store";
import {MatSnackBar} from "@angular/material/snack-bar";
import {environment} from "../environments/environment";
import { Locales, THEME, TonConnectUI, Wallet as TgWallet} from "@tonconnect/ui";
import {TranslateService} from "@ngx-translate/core";

interface CashoutState {
  currencies: {
    [Currencies.USD]: CurrencyStore,
    [Currencies.RUB]: CurrencyStore
  },
  userSavings: number,
  loading: boolean,
  error: unknown,
}

const initialState: CashoutState = {
  currencies: {
    [Currencies.USD]: {
      statistic: "",
      currentValue: 0,
      userSavings: "",
      direction: true
    },
    [Currencies.RUB]: {
      statistic: "",
      currentValue: 0,
      userSavings: "",
      direction: true
    }
  },
  userSavings: 0,
  loading: false,
  error: undefined
}

@Injectable({
  providedIn: "root"
})
export class CashoutStore extends ComponentStore<CashoutState> implements OnStoreInit {
  public readonly usd$: Observable<CurrencyStore> = this.select((state) => state.currencies[Currencies.USD]);
  public readonly rub$: Observable<CurrencyStore> = this.select((state) => state.currencies[Currencies.RUB]);
  public readonly savings$: Observable<number> = this.select((state) => state.userSavings);

  public readonly setLoadingState = this.updater((state, loading: boolean) => ({
    ...state,
    loading
  }));
  public readonly setRateFailure = this.updater((state, error: unknown) => ({
    ...state,
    error,
    loading: false,
  }));
  public readonly setRateSuccess = this.updater((state, payload: GetCurrencyRateDtoResponse) => {
    const source = payload.rates.TON;
    const usdPrice = source.prices.USD;
    const usdStatistic = source.diff_24h.USD;
    const rubPrice = source.prices.RUB;
    const rubStatistic = source.diff_24h.RUB;
    const userUsdSavings = Number(usdPrice) * state.userSavings;
    const userRubSavings = Number(rubPrice) * state.userSavings;

    return {
      ...state,
      loading: false,
      error: undefined,
      currencies: {
        ...state.currencies,
        [Currencies.USD]: {
          currentValue: usdPrice,
          statistic: usdStatistic,
          userSavings: numeral(userUsdSavings).format("0.[000000]"),
          direction: usdStatistic.at(0) == '+'
        },
        [Currencies.RUB]: {
          currentValue: rubPrice,
          statistic: rubStatistic,
          userSavings: numeral(userRubSavings).format("0.[000000]"),
          direction: rubStatistic.at(0) == '+'
        }
      }
    }
  });
  public readonly setUserSavings = this.updater((state, payload: number) => {
    const userUsdSavings = state.currencies[Currencies.USD].currentValue * payload;
    const userRubSavings = state.currencies[Currencies.RUB].currentValue * payload;

    return {
      ...state,
      userSavings: payload,
      error: undefined,
      loading: false,
      currencies: {
        [Currencies.USD]: {
          ...state.currencies[Currencies.USD],
          userSavings: numeral(userUsdSavings).format("0.[000000]")
        },
        [Currencies.RUB]: {
          ...state.currencies[Currencies.RUB],
          userSavings: numeral(userRubSavings).format("0.[000000]")
        }
      }
    }
  })


  public readonly loadRate = this.effect((body$: Observable<void>) => {
    return body$.pipe(
      tap(() => this.setLoadingState(true)),
      switchMap(() => this.cashoutService.getRates().pipe(
        switchMap((response) => {
          if ('error' in response) {
            return throwError(() => new Error(response.error))
          }
          return of(response)
        }),
        retry({ delay: 2000, resetOnSuccess: true, count: 5 }),
        tap({
          next: (response) => {
            this.setRateSuccess(response);
          },
          error: (err) => {
            this.setRateFailure(err);
            this.matSnackBar.open(err)
          }
        }),
        catchError(() => EMPTY)
      ))
    )
  })

  constructor(
    private cashoutService: CashoutService,
    private walletStore: WalletStore,
    private matSnackBar: MatSnackBar
  ) {
    super(initialState);
  }

  ngrxOnStoreInit() {
    this.walletStore.wallet$.pipe(
      takeUntil(this.destroy$),
      map((wallet) => wallet?.tons || 0)
    ).subscribe((value) => {
      this.setUserSavings(value);
    });
  }
}
