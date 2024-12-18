import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {TelegramService} from "../../services/telegram.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Task} from "../../interface/models/task";
import {TasksStore} from "../../stores/tasks.store";
import {AsyncPipe, NgIf} from "@angular/common";
import {filter, map, Observable, of, Subscription, switchMap, take, tap} from "rxjs";
import {UiService} from "../../services/ui.service";
import {TaskAction} from "../../interface/enum/task-action";
import {RefsStore} from "../../stores/refs-store.service";
import {RefTaskDetails} from "../../interface/other/task-details/ref-task.details";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthStore} from "../../stores/auth.store";

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatDialogClose,
    MatDialogContent,
    TranslateModule,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss'
})
export class TaskDialogComponent implements OnInit, OnDestroy {

  public isCLickedJoined: boolean = false
  public data: Task = inject<Task>(MAT_DIALOG_DATA);
  private subscriptions = new Subscription();
  public claimBtnLoading: boolean = false;
  public isActionButtonVisible: boolean = false;
  public actionButtonText$: Observable<string> = of(this.data.action).pipe(
    map((type) => {
      switch (type) {
        case TaskAction.REF:
          return this.translateService.instant('invite_friends');
        default:
          return ''
      }
    })
  )

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    private telegramService: TelegramService,
    private taskStore: TasksStore,
    private uiService: UiService,
    private cdRef: ChangeDetectorRef,
    private refsStore: RefsStore,
    private matSnackBar: MatSnackBar,
    private translateService: TranslateService,
    private authStore: AuthStore,
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
      case TaskAction.REF:
        return this.handleRefCheck();
      default:
        return this.handleLinkClick();
    }
  }

  public handleActionButtonClick(): void {
    switch (this.data.action) {
      case TaskAction.REF:
        this.authStore.user$.pipe(
          take(1),
          filter(authUser => !!authUser),
        ).subscribe((authUser) => {
          this.telegramService.shareInviteContent(authUser!);
        });
    }
  }

  public confirmTask(): void {
    this.taskStore.complete(this.data.id);
  }

  private handleRefCheck(): void {
    this.claimBtnLoading = true;
    this.refsStore.refsCount$
      .pipe(
        switchMap((count) => this.refsStore.loaded$.pipe(
          tap((state) => {
            if (!state) {
              this.refsStore.loadRefs()
            }
          }),
          filter(state => state),
          take(1),
          map(() => count)
        ))
      )
      .subscribe((count) => {
        if (count >= (this.data.details as RefTaskDetails).count) {
          this.isCLickedJoined = true;
          this.isActionButtonVisible = false;
        } else {
          this.isActionButtonVisible = true;
          this.matSnackBar.open(
            this.translateService.instant('invalid_refs_count')
          )
        }
        this.claimBtnLoading = false;
      });
  }

  private handleStarInvoice(): void {
    this.claimBtnLoading = true;
    this.taskStore.getStarInvoiceLink(this.data.id);
    this.taskStore.starInvoiceLink$.pipe(
      filter((link) => !!link),
      take(1)
    ).subscribe((link) => {
      this.claimBtnLoading = false;
      this.telegramService.openInvoice(link!, (state) => {
        if (state === 'paid') {
          this.isCLickedJoined = true;
          this.cdRef.detectChanges();
        }
      })
    });
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
}
