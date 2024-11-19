import {Component} from '@angular/core';
import { MatDialogClose, MatDialogContent} from "@angular/material/dialog";
import { AsyncPipe, DatePipe, NgForOf, NgIf } from "@angular/common";
import {MatButton} from "@angular/material/button";
import {BoostStore} from "../../stores/boost.store";
import {Observable} from "rxjs";
import {Boost} from "../../interface/models/boost";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-purchases-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    NgForOf,
    NgIf,
    MatButton,
    MatDialogClose,
    AsyncPipe,
    DatePipe,
    TranslateModule
  ],
  templateUrl: './purchases-dialog.component.html',
  styleUrl: './purchases-dialog.component.scss'
})
export class PurchasesDialogComponent {

  public purchasesBoosts: Observable<Boost[]>  = this.boostStore.getPurchasesBoosts$;
  private activeBoost: Boost | undefined;

  constructor(
    public readonly boostStore: BoostStore,
  ) {
    this.boostStore.boost$.subscribe(boost => this.activeBoost = boost)
  }

  public checkActiveBoost(boost: Boost): string {
    if (this.activeBoost?.id === boost.id)
      return '1px solid rgb(242, 128, 86)';
    return '';
  }
}
