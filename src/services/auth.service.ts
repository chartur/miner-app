import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../interface/models/user";
import {endpoints} from "../environments/environment";
import {TelegramSyncDto} from "../interface/dto/telegram-sync.dto";
import {AuthDataResponseDto} from "../interface/dto/auth-data.response.dto";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(
    private httpClient: HttpClient
  ) {}

  public syncUserData(
    body: TelegramSyncDto,
    queryParams?: Record<string, string>
  ): Observable<AuthDataResponseDto> {
    return this.httpClient.put<AuthDataResponseDto>(endpoints.auth.saveUser, body, {
      params: queryParams
    });
  }

  public me(): Observable<User> {
    return this.httpClient.get<User>(endpoints.auth.me);
  }

  public syncUserDataDebug(tUserId: string): Observable<AuthDataResponseDto> {
    return this.httpClient.put<AuthDataResponseDto>(endpoints.auth.saveUserDebug, undefined, {
      params: {
        tUserId
      }
    });
  }
}
