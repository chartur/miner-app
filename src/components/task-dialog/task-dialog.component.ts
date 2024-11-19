import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {TaskInterface} from "../../interface/task.interface";
import {TelegramService} from "../../services/telegram.service";
import {environment} from "../../environments/environment";
import {TranslateModule} from "@ngx-translate/core";
import {Router} from "@angular/router";

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

  public data: TaskInterface = inject<TaskInterface>(MAT_DIALOG_DATA);

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
  ) {}

  public onClick () {
    window.location.href = this.data.link;
    this.dialogRef.close();
  }
}
