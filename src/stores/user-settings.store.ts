import {Injectable} from "@angular/core";
import {ComponentStore} from "@ngrx/component-store";
import {catchError, EMPTY, Observable, switchMap, tap} from "rxjs";
import {ConfigService} from "../services/config.service";
import {UserSettings} from "../interface/models/user-settings";

interface UserSettingsState extends UserSettings {
  isLoaded: boolean;
}

const initialState: UserSettingsState = {
  claimNotificationEnabled: false,
  claimNotificationExpiration: null,
  isLoaded: false
}

@Injectable({
  providedIn: "root"
})
export class UserSettingsStore extends ComponentStore<UserSettingsState> {
  public readonly claimNotificationEnabled$: Observable<boolean> = this.select((state) => state.claimNotificationEnabled);
  public readonly isLoaded$: Observable<boolean> = this.select((state) => state.isLoaded);

  public readonly setSettingsSuccess = this.updater((state, payload: UserSettings) => ({
    ...state,
    ...payload,
    isLoaded: true
  }));
  public setClaimNotificationDataSuccess = this.updater((state, payload: { enabled: boolean, expiration: Date | null }) => ({
    ...state,
    claimNotificationEnabled: payload.enabled,
    claimNotificationExpiration: payload.expiration,
  }));

  constructor() {
    super(initialState);
  }
}
