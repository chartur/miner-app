import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {TelegramService} from "../../services/telegram.service";
import {TranslateModule} from "@ngx-translate/core";
import {Task} from "../../interface/models/task";
import {TasksStore} from "../../stores/tasks.store";

type State = 'Join' | 'Complete';

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
  public joinState: State = this.data.isCompleted ? 'Complete' : 'Join';

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    private telegramService: TelegramService,
    private taskStore: TasksStore
  ) {}

  public onClick(): void {
    if (this.data.isCompleted) {
      return
    }
    this.telegramService.openLink(this.data.link)

    setTimeout(() => {
      this.joinState = 'Complete';
    }, 10000);
    //this.taskStore.setTaskIsComplete(this.data);
    this.dialogRef.close();
  }
}
