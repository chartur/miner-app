import { Component, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe, DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {MatFabButton} from "@angular/material/button";
import {NavComponent} from "../navbar/nav.component";
import {ProcessorComponent} from "../processor/processor.component";
import {TranslateModule} from "@ngx-translate/core";
import {AuthStore} from "../../stores/auth.store";
import {
  filter,
  interval,
  map,
  Observable,
  Subject,
  Subscription,
  switchMap, take,
  takeUntil,
  takeWhile,
  tap,
  zip
} from "rxjs";
import {User} from "../../interface/models/user";
import {WalletStore} from "../../stores/wallet.store";
import {BoostLevels} from "../../interface/enum/boost-levels";
import moment from "moment";
import numeral from "numeral"
import {TaskDialogComponent} from "../task-dialog/task-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ClaimRefsDialogComponent} from "../claim-refs-dialog/claim-refs-dialog.component";
import {UiService} from "../../services/ui.service";
import {ConfigStore} from "../../stores/config.store";
import {BoostStore} from "../../stores/boost.store";
import {TgDialogComponent} from "../tg-dialog/tg-dialog.component";

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    MatFabButton,
    DecimalPipe,
    NavComponent,
    ProcessorComponent,
    NgForOf,
    TranslateModule,
    AsyncPipe
  ],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
})
export class GameBoardComponent implements OnInit, OnDestroy {

    public loading: boolean = false;
    public user;
    public processorCount: number = 1;
    public processorCountArray: Array<number> = new Array<number>(3);
    public avatarUrl: string = '/assets/icon-profile-picture.png';
    public user$: Observable<User | undefined> = this.authStore.user$;
    public currentClaimMaxAmount$: Observable<number> = this.boostStore.boost$.pipe(
      switchMap((boost) => this.configStore.boostDetails$.pipe(
        take(1),
        map(boostDetails => {
          const level = boost?.boostLevel || BoostLevels.USUAL;
          return boostDetails[level].perClaim;
        })
      ))
    );
    public isClaimAvailable = false;
    public collectedTon$: Observable<string> = this.walletStore.wallet$.pipe(
      map(wallet => wallet?.tons ? numeral(wallet?.tons).format('0.[000000000]') : '0')
    );
    isFirstTimeMining$: Observable<boolean> = this.walletStore.wallet$.pipe(
      map((wallet) => !wallet?.lastClaimDateTime)
    );

    calculator$: Observable<number>;

    private calculatorSubject: Subject<void>;
    private subscription: Subscription = new Subscription();

    constructor(
      private authStore: AuthStore,
      private walletStore: WalletStore,
      private boostStore: BoostStore,
      private uiService: UiService,
      private configStore: ConfigStore,
      public dialog: MatDialog,
    ) {}

    ngOnInit() {
      this.subscription.add(
        this.user$.subscribe((user) => {
          if (user?.photoUrl) {
            const url = new URL(user.photoUrl);
            url.searchParams.append('ts', Date.now().toString());
            this.avatarUrl = url.toString();
          }
        })
      );
      this.subscription.add(
        zip([
          this.boostStore.boost$.pipe(
            map(boost => boost?.boostLevel || BoostLevels.USUAL)
          ),
          this.configStore.boostDetails$
        ])
          .pipe(
            filter(([boostLevel, boostDetails]) => !!boostDetails)
          )
          .subscribe(([boostLevel, boostDetails]) => {
            this.processorCount = boostDetails[boostLevel].processorCount;
            this.processorCountArray = new Array<number>(this.processorCount);
          })
      )
      this.subscription.add(
        this.walletStore.needToShowSubscribeModal$.subscribe(() => {
          this.openCommunityDialog();
        })
      )
      this.subscription.add(
        this.walletStore.successfullyClaimed$.subscribe(() => {
          this.uiService.runFireworks();
        })
      )
      this.prepareCalculator();
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

    claim(): void {
      this.walletStore.claim();
      this.prepareCalculator();
    }

    private prepareCalculator(): void {
      this.isClaimAvailable = false;
      this.calculatorSubject = new Subject<void>();
      this.calculator$ = interval(1000).pipe(
        switchMap(() => zip([
          this.walletStore.loading$,
          this.isFirstTimeMining$,
        ])),
        takeWhile(([loading, firstTimeMining]) => !loading && !firstTimeMining),
        takeUntil(this.calculatorSubject),
        switchMap(() => zip([
          this.boostStore.boost$,
          this.configStore.boostDetails$
        ])),
        map(([boost, boostDetails]) => {
          const boostLevel = boost?.boostLevel || BoostLevels.USUAL;
          return {
            amountPerSecond: boostDetails[boostLevel].perSecondNonotonRevenue,
            maxAmount: boostDetails[boostLevel].perClaim
          };
        }),
        switchMap(({ amountPerSecond, maxAmount}) => this.walletStore.wallet$.pipe(
          map((wallet) => {
            const seconds = moment().diff(wallet!.lastClaimDateTime, 'seconds');
            let value = seconds * amountPerSecond;
            if (value >= maxAmount) {
              value = maxAmount;
              this.calculatorSubject.next();
              this.calculatorSubject.complete();
              this.isClaimAvailable = true;
            }
            return numeral(value).format('0.[000000000]');
          })
        )),
      )
    }

    private openCommunityDialog(): void {
      this.dialog.open(TgDialogComponent, {
        hasBackdrop: true,
        width: "100%",
        height: `${window.innerHeight / 2}px`,
        position: { bottom: "30%" },
        delayFocusTrap: true,
        role: "alertdialog",
        closeOnNavigation: true,
        ariaModal: true,
        panelClass: "dialog-style",
      });
    }
}
