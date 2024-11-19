import {Component, OnInit} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { NavComponent } from "../components/navbar/nav.component";
import {CommonModule} from "@angular/common";

import {JoinCommunityComponent} from "../pages/join-community/join-community.component";
import {LoadingComponent} from "../components/loading/loading.component";
import {AuthStore} from "../stores/auth.store";
import {delay, filter, Observable, take} from "rxjs";
import {AppViaWebNotWorkingComponent} from "../pages/app-via-web-not-working/app-via-web-not-working.component";
import {TelegramService} from "../services/telegram.service";
import {RefsStore} from "../stores/refs-store.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavComponent,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    JoinCommunityComponent,
    LoadingComponent,
    AppViaWebNotWorkingComponent
  ],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  public title: string = 'Ton miner';
  public isAppLoaded$: Observable<boolean> = this.authStore.authLoading$;
  public isAllowToMine: boolean = true

  constructor(
    private authStore: AuthStore,
    private refStore: RefsStore,
    private tgService: TelegramService,
  ) {


    console.log(tgService.initDataString, "   asdsad")
    // if () {
    //
    // }

    if (this.tgService.platform !== 'unknown') {
      this.isAllowToMine = true
    }
  }

  ngOnInit() {
    this.isAppLoaded$.pipe(
      filter(loaded => !loaded),
      take(1),
      delay(3000),
    ).subscribe(() => {
      this.refStore.checkRefProfit();
    })
  }
}
