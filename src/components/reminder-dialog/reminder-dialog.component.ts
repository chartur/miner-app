import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {BoostStore} from "../../stores/boost.store";
import {DialogRef} from "@angular/cdk/dialog";

@Component({
  selector: 'app-reminder-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatDialogClose,
    MatDialogContent,
    TranslateModule
  ],
  templateUrl: './reminder-dialog.component.html',
  styleUrl: './reminder-dialog.component.scss'
})
export class ReminderDialogComponent {

  constructor(
    private boostStore: BoostStore,
    public dialogRef: MatDialogRef<ReminderDialogComponent>,
  ) {}

  public buyReminder(): void {
    this.boostStore.getClaimNotificationInvoiceLink();
    this.dialogRef.close();
  }

}
