import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {NavComponent} from "../../components/navbar/nav.component";
import {CashOutDialogComponent} from "../../components/cash-out-dialog/cash-out-dialog.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {map, Observable, Subscription, take, tap} from "rxjs";
import {User} from "../../interface/models/user";
import {AuthStore} from "../../stores/auth.store";
import {CashoutStore} from "../../stores/cashout.store";
import {CurrencyStore} from "../../interface/other/currency-store";
import numeral from "numeral";
import {Wallet} from "@tonconnect/ui";
import {
  ConfirmationDialogState,
  ConfirmationModalComponent
} from "../../components/confirmation-modal/confirmation-modal.component";
import {WalletStore} from "../../stores/wallet.store";

@Component({
  selector: 'app-cash-out',
  standalone: true,
  imports: [
    NgForOf,
    NgOptimizedImage,
    NavComponent,
    NgIf,
    TranslateModule,
    AsyncPipe
  ],
  templateUrl: './cash-out.component.html',
  styleUrl: './cash-out.component.scss'
})
export class CashOutComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  public avatarUrl: string = '/assets/icon-profile-picture.png';
  public user: User | undefined;
  public isTgWalletConnected: boolean = false;
  public usd$: Observable<CurrencyStore> = this.cashoutStore.usd$.pipe(
    map(value => ({
      ...value,
      currentValue: numeral(value.currentValue).format('0.[000000000]')
    }))
  );
  public rub$: Observable<CurrencyStore> = this.cashoutStore.rub$.pipe(
    map(value => ({
      ...value,
      currentValue: numeral(value.currentValue).format('0.[000000000]')
    }))
  );
  public savings$: Observable<number> = this.cashoutStore.savings$;

  constructor(
    private readonly dialog: MatDialog,
    private authStore: AuthStore,
    private cashoutStore: CashoutStore,
    private walletStore: WalletStore,
    private cdRef: ChangeDetectorRef,
    private matDialog: MatDialog,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.authStore.user$.subscribe((user) => {
        this.user = user;
        if (user?.photoUrl) {
          const url = new URL(user.photoUrl);
          url.searchParams.append('ts', Date.now().toString());
          this.avatarUrl = url.toString();
        }
      })
    );

    this.subscription.add(
      this.walletStore.isTgWalletConnected$.subscribe(
        (state) => {
          this.isTgWalletConnected = state;
          this.cdRef.detectChanges();
        }
      )
    )

    this.cashoutStore.loadRate()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public toggleTelegramWalletConnection(): void {
    this.walletStore.isTgWalletConnected$
      .pipe(
        take(1)
      )
      .subscribe(connected => {
        if (!connected) {
          this.walletStore.connectWallet();
          return;
        }

        const modalData: ConfirmationDialogState = {
          cancelBtnColor: '#408bd8',
          confirmBtnColor: '#ad0000',
          body: this.translateService.instant('wallet_disconnect_confirmation_message')
        }
        this.matDialog.open(ConfirmationModalComponent, {
          hasBackdrop: true,
          width: "45%",
          height: `${window.innerHeight / 2.2}px`,
          position: { bottom: "40%" },
          disableClose: true,
          role: "alertdialog",
          closeOnNavigation: true,
          ariaModal: true,
          data: modalData
        })

      })
  }

  openCashOutModal() {
    this.dialog.open(CashOutDialogComponent, {
      hasBackdrop: true,
      width: "90%",
      height: `${window.innerHeight / 2}px`,
      position: { bottom: "20%" },
      delayFocusTrap: true,
      role: "alertdialog",
      closeOnNavigation: true,
      ariaModal: true,
      panelClass: "dialog-style",
    })
  }

}
