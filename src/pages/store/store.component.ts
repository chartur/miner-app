import { Component } from '@angular/core';
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {BuyCoinDialogComponent} from "../../components/buy-coin-dialog/buy-coin-dialog.component";
import {ConfirmationModalComponent} from "../../components/confirmation-modal/confirmation-modal.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgStyle
  ],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss'
})
export class StoreComponent {

  public storeItems = [
    {
      profitByTib: 1000,
      costByStar: 200,
      imgSrc: '/assets/store/tib-1.png',
      locked: false,
      bought: false,
      soldOut: false,
      totalCount: 1000,
      color: 'red'
    },
    {
      profitByTib: 3000,
      costByStar: 300,
      imgSrc: '/assets/store/tib-2.png',
      locked: false,
      bought: false,
      soldOut: false,
      color: 'green',
      totalCount: 1000,
    },
    {
      profitByTib: 5000,
      costByStar: 500,
      imgSrc: '/assets/store/tib-3.png',
      locked: false,
      bought: false,
      soldOut: false,
      color: 'blue',
      totalCount: 1000,
    },
    {
      profitByTib: 6000,
      costByStar: 1000,
      imgSrc: '/assets/store/tib-4.png',
      locked: true,
      bought: false,
      soldOut: false,
      color: 'crimson',
      totalCount: 1000,
    }
  ]

  constructor(
    private matDialog: MatDialog
  ) {
  }

  public openDialog(coinData) {
    if (coinData.locked) {
      return
    }
    this.matDialog.open(BuyCoinDialogComponent, {
      hasBackdrop: true,
      width: "40%",
      height: `${window.innerHeight / 2}px`,
      position: { bottom: "30%" },
      disableClose: false,
      role: "alertdialog",
      closeOnNavigation: true,
      ariaModal: true,
      data: coinData
    })
  }

}
