import {User} from "../interface/models/user";
import {ComponentStore, OnStoreInit} from "@ngrx/component-store";
import {Injectable} from "@angular/core";
import {catchError, EMPTY, Observable, switchMap, tap} from "rxjs";
import {AuthService} from "../services/auth.service";
import {TelegramSyncDto} from "../interface/dto/telegram-sync.dto";
import {MatSnackBar} from "@angular/material/snack-bar";
import {StorageService} from "../services/storage.service";
import {AuthDataResponseDto} from "../interface/dto/auth-data.response.dto";
import {WalletStore} from "./wallet.store";
import {environment} from "../environments/environment";
import {BoostStore} from "./boost.store";

interface AuthState {
  user?: User,
  token?: string,
  loading: boolean,
  error: unknown,
}

const initialState: AuthState = {
  loading: true,
  user: undefined,
  token: undefined,
  error: undefined
}

@Injectable({
  providedIn: 'root'
})
export class AuthStore extends ComponentStore<AuthState> implements OnStoreInit {

  public readonly user$: Observable<User | undefined> = this.select(state => state.user);
  public readonly token$: Observable<string | unknown> = this.select(state => state.token);
  public readonly authLoading$: Observable<boolean> = this.select(state => state.loading);
  public readonly error$: Observable<unknown> = this.select(state => state.error);

  public readonly setLoading = this.updater((state, loading: boolean) => ({
    ...state,
    loading
  }));
  public readonly setUserSuccess = this.updater((state, payload: User) => ({
    ...state,
    user: payload,
    loading: false,
  }));
  public readonly setUserFailure = this.updater((state, error: unknown) => ({
    ...state,
    error,
    loading: false,
  }));
  public readonly setAuthDataSuccess = this.updater((state, payload: AuthDataResponseDto) => ({
    loading: false,
    error: undefined,
    user: payload.user,
    token: payload.token
  }));
  public readonly setAuthDataFailure = this.updater((state, error: unknown) => ({
    ...state,
    error,
    loading: false,
  }));

  public readonly syncUserData = this.effect((body$: Observable<{
    body: TelegramSyncDto,
    queryParams?: Record<string, string>
  }>) => {
    return body$.pipe(
      tap(() => this.setLoading(true)),
      switchMap(({ body, queryParams}) => this.authService.syncUserData(body, queryParams).pipe(
        tap({
          next: (authData) => {
            this.setAuthDataSuccess(authData);
            this.walletStore.setWalletDetails(authData.user.wallet);
            this.boostStore.setBoostSuccess(authData.user.boost);
            this.boostStore.setPurchasesBoosts(authData.user.boosts);
            this.storageService.set('user', authData.user);
            this.storageService.set('token', authData.token);
          },
          error: (e) => {
            const errorMessage = e.error.message || e.message;
            this.setAuthDataFailure(e);
            this.snackBar.open(errorMessage)
          }
        })
      ))
    )
  });

  public readonly me = this.effect((body$: Observable<void>) => {
    return body$.pipe(
      tap(() => this.setLoading(true)),
      switchMap(() => this.authService.me().pipe(
        tap({
          next: (user) => {
            this.setUserSuccess(user);
            this.walletStore.setWalletDetails(user.wallet);
            this.boostStore.setBoostSuccess(user.boost);
            this.boostStore.setPurchasesBoosts(user.boosts);
            this.storageService.set('user', user);
          },
          error: (e) => {
            const errorMessage = e.error.message || e.message;
            this.setUserFailure(e)
            this.snackBar.open(errorMessage)
          }
        })
      ))
    )
  })

  public readonly syncUserDataDebug = this.effect((body$: Observable<void>) => {
    return body$.pipe(
      tap(() => this.setLoading(false)),
      switchMap(() => this.authService.syncUserDataDebug(environment.tUserId).pipe(
        tap({
          next: (authData) => {
            this.setAuthDataSuccess(authData);
            this.walletStore.setWalletDetails(authData.user.wallet);
            this.boostStore.setBoostSuccess(authData.user.boost)
            this.storageService.set('user', authData.user);
            this.storageService.set('token', authData.token);
          },
          error: (e) => {
            const errorMessage = e.error.message || e.message;
            this.setAuthDataFailure(e);
            this.snackBar.open(errorMessage)
          }
        })
      ))
    )
  });

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private storageService: StorageService,
    private walletStore: WalletStore,
    private boostStore: BoostStore,
  ) {
    super(initialState);
  }

  ngrxOnStoreInit() {
    const user = this.storageService.get<User | null>('user');
    const token = this.storageService.get<string | null>('user');
    if (user && token) {
      this.setAuthDataSuccess({
        user,
        token
      })
    }
  }
}
