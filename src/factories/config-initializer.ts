import {ConfigStore} from "../stores/config.store";
import {filter, firstValueFrom, take, tap} from "rxjs";
import {AuthStore} from "../stores/auth.store";

export const configInitializer = (configStore: ConfigStore, authStore: AuthStore) => {
  return () => {
    return firstValueFrom(
      authStore.token$.pipe(
        filter((token) => !!token)
      )
    ).then(() => {
      configStore.loadConfigs();
    });
  };
};
