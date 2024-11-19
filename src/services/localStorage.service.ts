import {Injectable} from "@angular/core";
import * as _ from "lodash";
import {StorageService} from "./storage.service";
import {AuthStore} from "../stores/auth.store";
import {filter, take} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService extends StorageService {
  override storage: Storage = localStorage;

  constructor(
    private authStore: AuthStore
  ) {
    super();
    this.authStore.user$.pipe(
      filter(user => !!user),
      take(1)
    ).subscribe((user) => {
      this.storage_path += `_${user!.id}_${user!.tUserId}`
    })
  }
}
