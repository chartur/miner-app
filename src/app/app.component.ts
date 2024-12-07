import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { NavComponent } from "../components/navbar/nav.component";
import {CommonModule} from "@angular/common";

import {JoinCommunityComponent} from "../pages/join-community/join-community.component";
import {LoadingComponent} from "../components/loading/loading.component";
import {AuthStore} from "../stores/auth.store";
import {delay, filter, Observable, take} from "rxjs";
import {AppViaWebNotWorkingComponent} from "../pages/app-via-web-not-working/app-via-web-not-working.component";
import {RefsStore} from "../stores/refs-store.service";
import {version} from "../app-version";
import {GoogleTagManagerService} from "angular-google-tag-manager";
import {environment} from "../environments/environment";

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

  constructor(
    private authStore: AuthStore,
    private refStore: RefsStore,
    private router: Router,
    private gtmService: GoogleTagManagerService,
  ) {}

  ngOnInit() {
    console.log(`%cThe app version is ${version}`, 'color: blue; font-weight: bold; font-size: 30px');

    if (environment.production) {
      this.googleTagSub();
    }

    this.isAppLoaded$.pipe(
      filter(loaded => !loaded),
      take(1),
      delay(3000),
    ).subscribe(() => {
      this.refStore.checkRefProfit();
    })
  }

  private googleTagSub(): void {
    this.router.events.forEach(item => {
      if (item instanceof NavigationEnd) {
        const gtmTag = {
          event: 'page',
          pageName: item.url
        };

        this.gtmService.pushTag(gtmTag);
      }
    });
  }
}
