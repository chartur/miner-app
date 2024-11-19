import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Ref} from "../interface/models/ref";
import {endpoints} from "../environments/environment";
import {RefsProfitDto} from "../interface/dto/refs-profit.dto";
import {Wallet} from "../interface/models/wallet";
import {MyRefsDto} from "../interface/dto/my-refs.dto";

@Injectable({
  providedIn: 'root'
})
export class RefsService {
  constructor(
    private httpClient: HttpClient
  ) {}

  public getMyRefs(): Observable<MyRefsDto> {
    return this.httpClient.get<MyRefsDto>(endpoints.refs.getMyRefs);
  }

  public getRefsProfit(): Observable<RefsProfitDto> {
    return this.httpClient.get<RefsProfitDto>(endpoints.refs.getProfit)
  }

  public collectRefsProfit(): Observable<Wallet> {
    return this.httpClient.post<Wallet>(endpoints.refs.collect, undefined)
  }
}
