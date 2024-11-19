import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {GetCurrencyRateDtoResponse} from "../interface/dto/get-currency-rate.dto.response";
import {endpoints, environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CashoutService {
  constructor(private httpClient: HttpClient) {}

  public getRates(): Observable<GetCurrencyRateDtoResponse | { error: string }> {
    return this.httpClient.get<GetCurrencyRateDtoResponse>(endpoints.wallet.getRate)
  }
}
