import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Wallet} from "../interface/models/wallet";
import {endpoints} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  constructor(private httpClient: HttpClient) {}

  public claim(): Observable<Wallet> {
    return this.httpClient.put<Wallet>(endpoints.wallet.claim, undefined);
  }
}
