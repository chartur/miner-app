import {Injectable} from "@angular/core";
import {Task} from "../interface/models/task";
import {ComponentStore} from "@ngrx/component-store";
import {catchError, EMPTY, Observable, Subject, switchMap, tap} from "rxjs";
import {TasksService} from "../services/tasks.service";
import {WalletStore} from "./wallet.store";
import {CompleteTaskResponseDto} from "../interface/dto/complete-task.response.dto";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

interface TasksState {
  data: Task[],
  loading: boolean,
  error: unknown,
}

const initialState: TasksState = {
  data: [],
  loading: false,
  error: undefined
}

@Injectable({
  providedIn: 'root'
})
export class TasksStore extends ComponentStore<TasksState>{
  public readonly tasks$: Observable<Task[]> = this.select((state) => state.data);
  public readonly loading$: Observable<boolean> = this.select((state) => state.loading);
  public readonly error$: Observable<unknown> = this.select((state) => state.error);

  private _successfullyClaimed: Subject<void> = new Subject<void>();
  public successfullyClaimed$: Observable<void> = this._successfullyClaimed.asObservable();

  private setLoadingState = this.updater((state, loading: boolean) => ({
    ...state,
    loading,
  }));
  private readonly setDataSuccess = this.updater((state, payload: Task[]) => ({
    ...state,
    data: payload,
    loading: false,
    error: undefined
  }));
  private readonly setDataFailure = this.updater((state, error: unknown) => ({
    ...state,
    data: [],
    loading: false,
    error
  }));
  private readonly completeTaskSuccess = this.updater((state, payload: CompleteTaskResponseDto) => ({
    ...state,
    data: state.data.map((task) => {
      if (task.id === payload.taskId) {
        task.isCompleted = true;
      }
      return task
    }),
    loading: false,
    error: undefined,
  }));
  private readonly completeTaskFailure = this.updater((state, error: unknown) => ({
    ...state,
    error,
    loading: false,
  }));

  public readonly getAllTasks = this.effect((body$: Observable<void>) => {
    return body$.pipe(
      tap(() => this.setLoadingState(true)),
      switchMap(() => this.tasksService.getAll().pipe(
        tap({
          next: (data) => {
            this.setDataSuccess(data)
          },
          error: (err) => {
            console.error(err);
          }
        }),
        catchError(() => EMPTY)
      ))
    )
  });

  public readonly complete = this.effect((body$: Observable<string>) => {
    return body$.pipe(
      tap(() => this.setLoadingState(true)),
      switchMap((taskId) => this.tasksService.complete(taskId).pipe(
        tap({
          next: (data) => {
            this._successfullyClaimed.next();
            this.completeTaskSuccess(data);
            this.walletStore.setTibcoins(data.total);
          },
          error: (err) => {
            const errorMessage = err.error.message || err.message;
            this.completeTaskFailure(err);
            this.matSnackBar.open(errorMessage);
          }
        }),
        catchError(() => EMPTY)
      ))
    )
  })

  constructor(
    private tasksService: TasksService,
    private walletStore: WalletStore,
    private matSnackBar: MatSnackBar,
  ) {
    super(initialState);
  }
}
