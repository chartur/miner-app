import {Injectable} from "@angular/core";
import {Ref} from "../interface/models/ref";
import {ComponentStore, OnStoreInit} from "@ngrx/component-store";
import {catchError, EMPTY, filter, Observable, Subject, switchMap, take, tap} from "rxjs";
import {RefsService} from "../services/refs.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LocalStorageService} from "../services/localStorage.service";
import {MatDialog} from "@angular/material/dialog";
import {ClaimRefsDialogComponent} from "../components/claim-refs-dialog/claim-refs-dialog.component";
import {RefsProfitDto} from "../interface/dto/refs-profit.dto";
import {AuthStore} from "./auth.store";
import {MyRefsDto} from "../interface/dto/my-refs.dto";

interface RefState {
  data: Ref[],
  totalRevenue: number,
  loading: boolean,
  error: unknown,
  updatedAt?: Date,
}

const initState: RefState = {
  data: [],
  totalRevenue: 0,
  loading: false,
  error: undefined,
  updatedAt: undefined,
}

@Injectable({
  providedIn: 'root'
})
export class RefsStore extends ComponentStore<RefState> implements OnStoreInit {

  public readonly totalRevenue$: Observable<number> = this.select((state) => state.totalRevenue);
  public readonly refs$: Observable<Ref[]> = this.select((state) => state.data);
  public readonly loading$: Observable<boolean> = this.select((state) => state.loading);
  public readonly error$: Observable<unknown> = this.select((state) => state.error);

  private _successfullyCollected: Subject<void> = new Subject<void>();
  public readonly successfullyCollected$: Observable<void> = this._successfullyCollected.asObservable();

  public readonly setLoadingState = this.updater((state, loading: boolean) => ({
    ...state,
    loading
  }));

  public readonly setRefsSuccess = this.updater((state, payload: MyRefsDto) => ({
    ...state,
    data: payload.refs,
    totalRevenue: payload.totalRevenue,
    loading: false,
    error: undefined,
    updatedAt: new Date()
  }))
  public readonly setRefsFailure = this.updater((state, error: unknown) => ({
    ...state,
    error,
    data: [],
    loading: false,
  }));

  public readonly loadRefs = this.effect((body$: Observable<void>) => {
    return body$.pipe(
      switchMap(() => this.state$.pipe(
        take(1)
      )),
      filter((state) => {
        return true;
        /**
         *  uncomment this
         */
        // return !state.updatedAt || moment().diff(moment(state.updatedAt), 'days') > 3
      }),
      tap(() => this.setLoadingState(true)),
      switchMap(() => this.refsService.getMyRefs().pipe(
        tap({
          next: (data) => {
            this.setRefsSuccess(data);
            this.localStorageService.set<RefState>('refs', this.state())
          },
          error: (e) => {
            this.setRefsFailure(e);
            const errMessage: string = e.error.message || e.message;
            this.matSnackBar.open(errMessage)
          }
        }),
        catchError(() => EMPTY)
      ))
    )
  });

  public readonly checkRefProfit = this.effect((body$: Observable<void>) => {
    return body$.pipe(
      switchMap(() => this.refsService.getRefsProfit().pipe(
        tap({
          next: (data) => {
            this.openRefsModal(data);
          }
        }),
        catchError(() => EMPTY)
      ))
    )
  });

  public readonly collectRef = this.effect((body$: Observable<void>) => {
    return body$.pipe(
      switchMap(() => this.refsService.collectRefsProfit().pipe(
        switchMap((wallet) => this.authStore.user$.pipe(
          take(1),
          tap({
            next: (user) => {
              this.authStore.setUserSuccess({
                ...user!,
                wallet,
              });
              this.matSnackBar.open('You have successfully claimed your profit');
              this._successfullyCollected.next();
            },
            error: (e) => {
              this.matSnackBar.open(e.error.message);
            }
          }),
          catchError(() => EMPTY)
        )),
      ))
    )
  })

  constructor(
    private refsService: RefsService,
    private matSnackBar: MatSnackBar,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog,
    private authStore: AuthStore,
  ) {
    super(initState);
  }

  ngrxOnStoreInit() {
    const data = this.localStorageService.get<RefState>('refs');
    if (data) {
      this.setState(data)
    }
  }

  public openRefsModal(data: RefsProfitDto): void {
    this.dialog.open(ClaimRefsDialogComponent, {
      data,
      hasBackdrop: true,
      width: "100%",
      height: '350px',
      position: { bottom: "30%" },
      delayFocusTrap: true,
      role: "alertdialog",
      closeOnNavigation: true,
      ariaModal: true,
      panelClass: "dialog-style",
    });
  }
}
