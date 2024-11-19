import { Component } from '@angular/core';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {CommonModule, NgFor, NgForOf, NgOptimizedImage} from "@angular/common";
import {BoostDialogComponent} from "../../components/boost-dialog/boost-dialog.component";
import {NavComponent} from "../../components/navbar/nav.component";
import {TranslateModule} from "@ngx-translate/core";
import {boosts} from "../../constants/boosts";
import {AutoClaimDialogComponent} from "../../components/auto-claim-dialog/auto-claim-dialog.component";
import {ConfigStore} from "../../stores/config.store";
import {filter, map, Observable} from "rxjs";
import {BoostExpendedDetails} from "../../interface/other/boost-expended-details";
import {PurchasesDialogComponent} from "../../components/purchases-dialog/purchases-dialog.component";

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
export class BoostComponent {

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
    )

  constructor(
    public dialog: MatDialog,
    private configStore: ConfigStore,
  ) {}

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
}
