import {Injectable} from "@angular/core";
import {Task} from "../interface/models/task";
import {ComponentStore} from "@ngrx/component-store";
import {catchError, EMPTY, Observable, switchMap, tap} from "rxjs";
import {TasksService} from "../services/tasks.service";

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

  public readonly setTaskIsComplete = this.effect((body$: Observable<Task>) => {
    return body$.pipe(
      switchMap((body) => this.tasksService.updateTask(body).pipe(
        tap({
          next: (data) => {
            //this.setDataSuccess(data)
          },
          error: (err) => {
            console.error(err);
          }
        }),
        catchError(() => EMPTY)
      ))
    )
  })

  constructor(
    private tasksService: TasksService
  ) {
    super(initialState);
  }
}
