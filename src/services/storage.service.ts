import {Injectable} from "@angular/core";
import * as _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  protected storage_path = "ton_miner_storage";

  protected storage: Storage = sessionStorage;


  public get<T>(path: string): T | undefined {
    return _.get(this.store, path);
  }

  public set<T>(property: string, value: T): void {
    const storage = this.store;
    _.set(storage, property, value);
    this.store = storage;
  }

  public destroy(): void {
    this.storage.removeItem(this.storage_path);
  }

  public get store(): Record<string, any> {
    const storage = this.storage.getItem(this.storage_path);
    return storage ? JSON.parse(storage) : {};
  }

  private set store(data) {
    this.storage.setItem(this.storage_path, JSON.stringify(data));
  }
}
