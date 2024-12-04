import {Component, inject} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogContent} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {BoostExpendedDetails} from "../../interface/other/boost-expended-details";

@Component({
  selector: 'app-buy-coin-dialog',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButton,
    MatDialogClose,
    MatDialogContent,
    TranslateModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './buy-coin-dialog.component.html',
  styleUrl: './buy-coin-dialog.component.scss'
})
export class BuyCoinDialogComponent {

  readonly data = inject(MAT_DIALOG_DATA);

}
