import {Injectable} from "@angular/core";
import {TelegramSyncDto} from "../interface/dto/telegram-sync.dto";
import {StorageService} from "./storage.service";
import {User} from "../interface/models/user";
import {Language} from "../interface/enum/language";
import {Observable, Subject} from "rxjs";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TelegramService {
  private app: any;
  private webView: any;
  private utils: any;

  private _qrStream: Subject<string> = new Subject();
  public qrStream$: Observable<string> = this._qrStream.asObservable();

  constructor(
    private storageService: StorageService
  ) {}

  public openTelegramCommunity(): void {
    this.app.openTelegramLink(environment.communityChannelLink);
  }

  public init(): void {
    this.app = (window as any).Telegram.WebApp;
    this.webView = (window as any).Telegram.WebView;
    this.utils = (window as any).Telegram.Utils;
    this.app.expand();
    this.app.enableClosingConfirmation();
    this.app.disableVerticalSwipes();
    this.app.setHeaderColor('#040416');
    this.app.ready();

    this.prepareStorageData();
  }

  public get initDataString(): string {
    return this.app.initData;
  }

  public get tSessionData(): TelegramSyncDto | undefined {
    return this.app.initDataUnsafe
  }

  public openLink(url: string): void {
    this.app.openLink(url);
  }

  public openTelegramLink(url: string): void {
    this.app.openTelegramLink(url);
  }

  public get platform(): string {
    return window['Telegram'].WebApp.platform;
  }

  public readQR(): void {
    try {
      this.app.showScanQrPopup({}, (data) => {
        let qrData: string = '';
        try {
          qrData = new URL(data).pathname.slice(1);
        } catch (e) {
          qrData = data;
        } finally {
          this.app.closeScanQrPopup()
        }
        this._qrStream.next(qrData);
      });
    } catch (e) {
      console.error(e)
    }
  }

  private prepareStorageData() {
    const isLoaded = this.storageService.get('isLoaded');
    if (!isLoaded) {
      const tUser = this.tSessionData?.user;
      let user: User | null = null;
      if (tUser) {
        user = {
          id: '',
          tUserId: tUser.id.toString(),
          firstName: tUser.first_name,
          lastName: tUser.last_name,
          languageCode: tUser.language_code as Language,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
      this.storageService.set('user', user);
      this.storageService.set('query_id', this.tSessionData?.query_id);
      this.storageService.set('hash', this.tSessionData?.hash);
      this.storageService.set('auth_date', this.tSessionData?.auth_date);
      this.storageService.set('isLoaded', true);
    }
  }
}
