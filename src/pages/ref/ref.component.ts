import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavComponent} from "../../components/navbar/nav.component";
import {CommonModule} from "@angular/common";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AuthStore} from "../../stores/auth.store";
import {User} from "../../interface/models/user";
import {Observable, Subscription} from "rxjs";
import {environment} from "../../environments/environment";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TelegramService} from "../../services/telegram.service";
import {Ref} from "../../interface/models/ref";
import {RefsStore} from "../../stores/refs-store.service";

@Component({
  selector: 'app-ref',
  standalone: true,
  imports: [
    NavComponent,
    CommonModule,
    TranslateModule
  ],
  templateUrl: './ref.component.html',
  styleUrl: './ref.component.scss'
})
export class RefComponent implements OnInit, OnDestroy {

  public userRefLink: string;
  private authUser: User | undefined;
  private subscription: Subscription = new Subscription();
  public refs: Ref[] = [];
  public refsLoading$: Observable<boolean> = this.refStore.loading$;
  public totalRevenue$: Observable<number> = this.refStore.totalRevenue$;

  constructor(
    private authStore: AuthStore,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
    private telegramService: TelegramService,
    private refStore: RefsStore
  ) {}

  ngOnInit() {
    this.initUserData();
    this.initRefsData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public copyRefLink (el: HTMLElement) {
    navigator.clipboard.writeText(el.innerText);
    this.matSnackBar.open(this.translateService.instant('successfully_copied'), '', {
      duration: 1000
    });
  }

  public shareRefLink() {
    if (!this.authUser) {
      return;
    }
    this.telegramService.shareInviteContent(this.authUser);
  }

  private initUserData(): void {
    this.subscription.add(
      this.authStore.user$.subscribe((user) => {
        this.authUser = user;
        if (this.authUser) {
          const userRefLink = new URL(environment.botUrl);
          userRefLink.searchParams.append('start', this.authUser.tUserId.toString());
          this.userRefLink = userRefLink.toString();
        }
      })
    );
  }

  private initRefsData(): void {
    this.subscription.add(
      this.refStore.refs$.subscribe(data => {
        this.refs = data;
      })
    )
    this.refStore.loadRefs();
  }
}
