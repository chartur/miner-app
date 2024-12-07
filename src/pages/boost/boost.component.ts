import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {CommonModule, NgFor, NgForOf, NgOptimizedImage} from "@angular/common";
import {BoostDialogComponent} from "../../components/boost-dialog/boost-dialog.component";
import {NavComponent} from "../../components/navbar/nav.component";
import {TranslateModule} from "@ngx-translate/core";
import {boosts} from "../../constants/boosts";
import {AutoClaimDialogComponent} from "../../components/auto-claim-dialog/auto-claim-dialog.component";
import {ConfigStore} from "../../stores/config.store";
import {filter, map, Observable, Subscription, tap} from "rxjs";
import {BoostExpendedDetails} from "../../interface/other/boost-expended-details";
import {PurchasesDialogComponent} from "../../components/purchases-dialog/purchases-dialog.component";
import {ReminderDialogComponent} from "../../components/reminder-dialog/reminder-dialog.component";
import {BoostStore} from "../../stores/boost.store";
import {TelegramService} from "../../services/telegram.service";
import moment from "moment";
import {UiService} from "../../services/ui.service";
import {UserSettingsStore} from "../../stores/user-settings.store";

@Component({
  selector: 'app-boost',
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    NgForOf,
    NgFor,
    CommonModule,
    NavComponent,
    NgOptimizedImage,
    TranslateModule
  ],
  templateUrl: './boost.component.html',
  styleUrl: './boost.component.scss'
})
export class BoostComponent implements OnInit, OnDestroy {

  public boostMiniDetails$: Observable<Array<BoostExpendedDetails>> = this.configStore.boostDetails$
    .pipe(
      filter(boostDetails => !!boostDetails),
      map((data) => {
        const { usual, ...other } = data;
        return other
      }),
      map(data => Object.keys(data).map((current) => ({
        ...data[current],
        ...boosts[current]
      }))),
    );

  private subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    private configStore: ConfigStore,
    private boostStore: BoostStore,
    private telegramService: TelegramService,
    private userSettingsStore: UserSettingsStore,
    private uiService: UiService,
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.boostStore.starInvoiceLink$.pipe(
        filter(link => link !== undefined),
      ).subscribe((link) => {
        this.telegramService.openInvoice(link!, (state) => this.claimReminderPaymentCallback(state));
        this.boostStore.setStarInvoiceLinkSuccess(undefined);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public buyBoost (data: BoostExpendedDetails): void {
    this.dialog.open(BoostDialogComponent, {
      hasBackdrop: true,
      width: "90%",
      height: `${window.innerHeight / 2}px`,
      position: { bottom: "50%" },
      disableClose: true,
      delayFocusTrap: true,
      role: "alertdialog",
      closeOnNavigation: true,
      ariaModal: true,
      panelClass: "dialog-style",
      data: data
    })
  }

  public openReminderDialog(): void {
    this.dialog.open(ReminderDialogComponent, {
      hasBackdrop: true,
      width: "90%",
      height: `${window.innerHeight / 1.8}px`,
      position: { bottom: "20%" },
      delayFocusTrap: true,
      role: "alertdialog",
      closeOnNavigation: true,
      ariaModal: true,
      panelClass: "dialog-style",
    })
  }

  public openAutoClaimModal() {
    this.dialog.open(AutoClaimDialogComponent, {
      hasBackdrop: true,
      width: "90%",
      height: `${window.innerHeight / 1.8}px`,
      position: { bottom: "20%" },
      delayFocusTrap: true,
      role: "alertdialog",
      closeOnNavigation: true,
      ariaModal: true,
      panelClass: "dialog-style",
    })
  }

  public openPurchasesDialog() {
    this.dialog.open(PurchasesDialogComponent, {
      hasBackdrop: true,
      width: "90%",
      height: `${window.innerHeight / 1.8}px`,
      position: { bottom: "50%" },
      delayFocusTrap: true,
      role: "alertdialog",
      closeOnNavigation: true,
      ariaModal: true,
      panelClass: "dialog-style"
    })
  }

  private claimReminderPaymentCallback(status: string): void {
    if (status === 'paid') {
      this.userSettingsStore.setClaimNotificationDataSuccess({
        enabled: true,
        expiration: moment().toDate(),
      });
      this.uiService.runFireworks();
    }
  }
}
