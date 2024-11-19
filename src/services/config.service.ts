import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ConfigsDto} from "../interface/dto/configs.dto";
import {endpoints} from "../environments/environment";

@Injectable({
  providedIn: "root"
})
export class ConfigService {
  constructor(
    private httpClient: HttpClient
  ) {}

  public loadConfig(): Observable<ConfigsDto> {
    return this.httpClient.get<ConfigsDto>(endpoints.config.get);
  }
}
