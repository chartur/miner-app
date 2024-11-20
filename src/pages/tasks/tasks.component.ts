import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {TaskDialogComponent} from "../../components/task-dialog/task-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {WalletStore} from "../../stores/wallet.store";
import {Observable} from "rxjs";
import {Wallet} from "../../interface/models/wallet";
import {TasksStore} from "../../stores/tasks.store";
import {Task} from "../../interface/models/task";

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgOptimizedImage,
    TranslateModule,
    AsyncPipe,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {

  @ViewChild('coin_tooltip') coin_tooltip: ElementRef;

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event): void {
    if (!this.coin_tooltip.nativeElement.contains(event.target)) {
      this.coin_tooltip.nativeElement.style.display = 'none';
    }
  }

  public wallet$: Observable<Wallet | undefined> = this.walletStore.wallet$;
  public tasksLoading$: Observable<boolean> = this.tasksStore.loading$;
  public tasks$: Observable<Task[]> = this.tasksStore.tasks$;

  public tibCoinInfoTooltip: string = 'none';
  public coinImgSrc: string = "/assets/tasks/icon-coin.png";

  constructor(
    public dialog: MatDialog,
    private walletStore: WalletStore,
    private tasksStore: TasksStore
  ) {}

  ngOnInit() {
    this.tasksStore.getAllTasks();
  }

  public completeTheTask (data: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      hasBackdrop: true,
      width: "90%",
      height: `${window.innerHeight / 1.8}px`,
      position: { bottom: "40%" },
      delayFocusTrap: true,
      role: "alertdialog",
      closeOnNavigation: true,
      ariaModal: true,
      panelClass: "dialog-style",
      data
    });
  }

  public toggleTooltip(): void {
    this.tibCoinInfoTooltip = this.tibCoinInfoTooltip === 'none' ? 'block': 'none'
  }
}
