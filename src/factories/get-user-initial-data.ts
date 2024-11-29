import {StorageService} from "../services/storage.service";
import {TelegramService} from "../services/telegram.service";
import {AuthStore} from "../stores/auth.store";
import {filter, firstValueFrom, tap} from "rxjs";
import {environment} from "../environments/environment";
import {resolve} from "@angular/compiler-cli";
import {version} from "../app-version";

export const getUserInitialData = (
  storageService: StorageService,
  telegramService: TelegramService,
  authStore: AuthStore
) => {
  return async () => {

    // await new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve('')
    //   }, 3000);
    // });

    if (!telegramService.initDataString) {
      alert(`Please open the telegram app v-${version}`)
      window.location.href = environment.botUrl;
      return;
    }

    if (!storageService.get<string | null>('token')) {
      const url = new URL(window.location.href);
      const refId = url.searchParams.get('ref');
      authStore.syncUserData({
        body: {
          ...telegramService.tSessionData!,
          initData: telegramService.initDataString,
        },
        queryParams: refId ? { ref: refId } : undefined
      });
    } else {
      authStore.me();
    }

    return firstValueFrom(authStore.token$.pipe(
      filter((token) => !!token)
    ));
  }
};

export const getUserInitialDataDebug = (
  storageService: StorageService,
  telegramService: TelegramService,
  authStore: AuthStore
) => {
  return () => {
    if (!storageService.get<string | null>('token')) {
      authStore.syncUserDataDebug();
    } else {
      authStore.me();
    }

    return firstValueFrom(authStore.token$.pipe(
      filter((token) => !!token)
    ));
  }
};
