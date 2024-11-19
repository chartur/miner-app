import {HttpEvent, HttpHandlerFn, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {inject} from "@angular/core";
import {StorageService} from "../services/storage.service";

export function jwtInterceptor (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const storage = inject(StorageService);
  const userToken = storage.get<string>('token');
  if (userToken) {
    const cloneReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${userToken}`)
    });
    return next(cloneReq);
  }
  return next(req);
}
