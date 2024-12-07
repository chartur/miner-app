import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {endpoints} from "../environments/environment";
import {Task} from "../interface/models/task";
import {CompleteTaskResponseDto} from "../interface/dto/complete-task.response.dto";
import {LinkResponseDto} from "../interface/dto/link.response.dto";

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  constructor(
    private httpClient: HttpClient
  ) {}

  public getAll(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(endpoints.tasks.getAll);
  }

  public complete(taskId: string): Observable<CompleteTaskResponseDto> {
    return this.httpClient.put<CompleteTaskResponseDto>(endpoints.tasks.complete, { taskId })
  }

  public getStarInvoiceLink(taskId: string): Observable<LinkResponseDto> {
    return this.httpClient.post<LinkResponseDto>(endpoints.tasks.starInvoice, { taskId })
  }
}
