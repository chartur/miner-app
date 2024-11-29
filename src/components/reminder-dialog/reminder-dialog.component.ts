import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatDialogClose, MatDialogContent} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";

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

  public buyReminder(): void {

  }

}
