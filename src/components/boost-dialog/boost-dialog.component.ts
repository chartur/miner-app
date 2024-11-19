import {Component, inject, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {AsyncPipe, NgIf} from "@angular/common";
import {BoostExpendedDetails} from "../../interface/other/boost-expended-details";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ConfigStore} from "../../stores/config.store";
import {catchError, EMPTY, filter, from, map, Observable, switchMap, take, tap} from "rxjs";
import {BoostLevels} from "../../interface/enum/boost-levels";
import numeral from "numeral";
import {BoostStore} from "../../stores/boost.store";
import {WalletStore} from "../../stores/wallet.store";

@Component({
  selector: 'app-boost-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatDialogClose,
    MatDialogContent,
    NgIf,
    TranslateModule,
    AsyncPipe
  ],
  templateUrl: './boost-dialog.component.html',
  styleUrl: './boost-dialog.component.scss'
})
export class BoostDialogComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<BoostDialogComponent>);
  readonly data = inject<BoostExpendedDetails>(MAT_DIALOG_DATA);
  public loading$: Observable<boolean> = this.boostStore.loading$;
  public description$: Observable<string> = this.configStore.boostDetails$.pipe(
    map((details) => details[BoostLevels.USUAL].perPeriodTonRevenue),
    map((usualPrice) => (this.data.perPeriodTonRevenue - this.data.price) * 100 / usualPrice),
    map((percentage) => numeral(percentage).format('0.[0]')),
    map(percentageString =>
      this.translateService.instant(this.data.description)
        .replace(':ton', this.data.price)
        .replace(':percent', percentageString)
        .replace(':cashback', this.data.refCashback)
    )
  );

  constructor(
    private router: Router,
    private configStore: ConfigStore,
    private boostStore: BoostStore,
    private translateService: TranslateService,
    private walletStore: WalletStore
  ) {}

  ngOnInit() {

  }

  public activate () {
    this.dialogRef.close();
    this.walletStore.isTgWalletConnected$.pipe(
      take(1),
    ).subscribe((state) => {
      if (state) {
        this.processPayment();
        return;
      }
      this.walletStore.connectWallet();
    });
  }

  private processPayment() {
    this.boostStore.getInvoice(this.data.name);
    this.boostStore.invoice$
      .pipe(
        filter((invoice) => !!invoice),
        take(1),
        switchMap((invoice) => from(this.walletStore.pay(invoice!))),
        catchError(() => EMPTY)
      )
      .subscribe((invoice) => {
        this.router.navigate(['']);
      });
  }
}
