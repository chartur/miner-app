import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {TelegramService} from "../../services/telegram.service";
import {TranslateModule} from "@ngx-translate/core";
import {Task} from "../../interface/models/task";

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatDialogClose,
    MatDialogContent,
    TranslateModule
  ],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss'
})
export class TaskDialogComponent {

  public data: Task = inject<Task>(MAT_DIALOG_DATA);

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    private telegramService: TelegramService
  ) {}

  public onClick(): void {
    console.log(this.data.profit, " Our crypto")
    //this.telegramService.openTelegramLink(data.link)
    //this.dialogRef.close();
  }
}
