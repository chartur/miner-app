import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {BoostLevels} from "../interface/enum/boost-levels";
import {endpoints} from "../environments/environment";
import {InvoiceDto} from "../interface/dto/invoice.dto";
import {LinkResponseDto} from "../interface/dto/link.response.dto";

@Injectable({
  providedIn: 'root'
})
export class BoostService {
  constructor(
    private httpClient: HttpClient
  ) {}

  public getInvoice(
    boostType: BoostLevels
  ): Observable<InvoiceDto> {
    return this.httpClient.post<InvoiceDto>(endpoints.boost.invoice, {
      boostType
    });
  }

  public getClaimNotificationInvoiceLink(): Observable<LinkResponseDto> {
    return this.httpClient.post<LinkResponseDto>(endpoints.boost.getClaimNotificationInvoiceLink, {});
  }
}
