import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {TelegramService} from "../../services/telegram.service";
import {TranslateModule} from "@ngx-translate/core";
import {Task} from "../../interface/models/task";
import {TasksStore} from "../../stores/tasks.store";
import {NgIf} from "@angular/common";
import {filter, Subscription, take} from "rxjs";
import {UiService} from "../../services/ui.service";
import {TaskAction} from "../../interface/enum/task-action";

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatDialogClose,
    MatDialogContent,
    TranslateModule,
    NgIf
  ],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss'
})
export class TaskDialogComponent implements OnInit, OnDestroy {

  public isCLickedJoined: boolean = false
  public data: Task = inject<Task>(MAT_DIALOG_DATA);
  private subscriptions = new Subscription();
  public claimBtnLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    private telegramService: TelegramService,
    private taskStore: TasksStore,
    private uiService: UiService,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.taskStore.successfullyClaimed$.subscribe(() => {
        this.uiService.runFireworks();
        this.dialogRef.close();
      })
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public onClick(): void {
    if (this.data.isCompleted) {
      return
    }

    switch (this.data.action) {
      case TaskAction.STAR_INVOICE:
        return this.handleStarInvoice();
      default:
        return this.handleLinkClick();
    }

  }

  private handleStarInvoice(): void {
    this.taskStore.starInvoiceLink$.pipe(
      filter((link) => !!link),
      take(1)
    ).subscribe((link) => {
      this.telegramService.openInvoice(link!, (state) => {
        if (state === 'paid') {
          this.isCLickedJoined = true;
          this.cdRef.detectChanges();
        }
      })
    });
    this.taskStore.getStarInvoiceLink(this.data.id);
  }

  private handleLinkClick(): void {
    if(this.data.isCompleted) {
      return
    }
    this.isCLickedJoined = true;
    this.claimBtnLoading = true;
    try {
      this.telegramService.openTelegramLink(this.data.link!)
    } catch (e) {
      this.telegramService.openLink(this.data.link!)
    }

    setTimeout(() => {
      this.claimBtnLoading = false;
    }, 4000);
  }

  public confirmTask(): void {
    this.taskStore.complete(this.data.id);
  }
}
