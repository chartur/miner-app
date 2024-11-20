import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {endpoints} from "../environments/environment";
import {Task} from "../interface/models/task";

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
}
