import {APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {HttpClient, provideHttpClient, withInterceptors} from "@angular/common/http";
import {TranslateLoader, TranslateModule, TranslateService} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TelegramService} from "../services/telegram.service";
import {AuthStore} from "../stores/auth.store";
import {StorageService} from "../services/storage.service";
import {provideComponentStore} from "@ngrx/component-store";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS} from "@angular/material/snack-bar";
import {jwtInterceptor} from "../interceptors/jwt.interceptor";
import {RefsStore} from "../stores/refs-store.service";
import {WalletStore} from "../stores/wallet.store";
import {getUserInitialData, getUserInitialDataDebug} from "../factories/get-user-initial-data";
import {telegramInitializer} from "../factories/telegram-initializer";
import {languageInitializer} from "../factories/language-initializer";
import {CashoutStore} from "../stores/cashout.store";
import {ConfigStore} from "../stores/config.store";
import {configInitializer} from "../factories/config-initializer";
import {environment} from "../environments/environment";
import {provideGoogleTagManager} from "angular-google-tag-manager";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const providers = [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideAnimationsAsync('noop'),
    provideHttpClient(
      withInterceptors([jwtInterceptor])
    ),
    provideComponentStore(AuthStore),
    provideComponentStore(RefsStore),
    provideComponentStore(WalletStore),
    provideComponentStore(CashoutStore),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 2500, verticalPosition: 'top'}
    },
    {
      provide: APP_INITIALIZER,
      useFactory: telegramInitializer,
      deps: [TelegramService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: getUserInitialData,
      deps: [StorageService, TelegramService, AuthStore],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: languageInitializer,
      deps: [StorageService, TranslateService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: configInitializer,
      deps: [ConfigStore, AuthStore],
      multi: true
    },
  ];

if (environment.production) {
  providers.push(
    provideGoogleTagManager({
      id: 'G-Q0G3V4PMDW'
    })
  )
}

export const appConfig: ApplicationConfig = {
  providers
};
