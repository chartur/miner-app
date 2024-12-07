import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {BoostStore} from "../../stores/boost.store";
import {DialogRef} from "@angular/cdk/dialog";
import {Observable} from "rxjs";
import {UserSettingsStore} from "../../stores/user-settings.store";
import {AsyncPipe, DatePipe} from "@angular/common";

@Component({
  selector: 'app-reminder-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatDialogClose,
    MatDialogContent,
    TranslateModule,
    AsyncPipe,
    DatePipe
  ],
  templateUrl: './reminder-dialog.component.html',
  styleUrl: './reminder-dialog.component.scss'
})
export class ReminderDialogComponent {

  public isReminderActive$: Observable<boolean> = this.userSettingsStore.claimNotificationEnabled$;
  public reminderValidUntil$: Observable<null | Date> = this.userSettingsStore.claimNotificationExpiration$;

  constructor(
    private boostStore: BoostStore,
    public dialogRef: MatDialogRef<ReminderDialogComponent>,
    private userSettingsStore: UserSettingsStore,
    private readonly translate: TranslateService,
  ) {}

  public buyReminder(): void {
    this.boostStore.getClaimNotificationInvoiceLink();
    this.dialogRef.close();
  }

}
