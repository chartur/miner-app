import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {TaskDialogComponent} from "../../components/task-dialog/task-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {TaskInterface} from "../../interface/task.interface";

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgOptimizedImage,
    TranslateModule,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {

  @ViewChild('coin_tooltip') coin_tooltip: ElementRef;

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event): void {
    if (!this.coin_tooltip.nativeElement.contains(event.target)) {
      this.coin_tooltip.nativeElement.style.display = 'none';
    }
  }

  public tibCoinInfoTooltip: string = 'none';
  public coinImgSrc: string = "/assets/tasks/icon-coin.png";
  public tasks: any = [
    {
      name: "Telegram",
      title: "Join community",
      description: "Connect directly with our community on Telegram! Get instant notifications, chat with like-minded individuals, and be the first to know about exciting news and updates.",
      isComplete: false,
      profitByTibCoin: 1000, // Our crypto
      link: "https://t.me/toon_mining",
      imgSrc: "./assets/tasks/icon-telegram.png"
    },
    {
      name: "Youtube",
      title: "Subscribe channel",
      description: "Stay updated and inspired! Subscribe to our YouTube channel for the latest videos, tutorials, and exclusive content tailored just for you!",
      isComplete: false,
      profitByTibCoin: 750, // Our crypto
      link: "https://www.youtube.com/watch?v=sNtyed7A5YA&list=RDsNtyed7A5YA&start_radio=1",
      imgSrc: "./assets/tasks/icon-youtube.png"
    },
    {
      name: "X",
      title: "Follow us on X",
      description: "Join our community on X for real-time updates, insights, and conversations! Follow us to stay connected and never miss out on the latest buzz.",
      isComplete: false,
      profitByTibCoin: 500, // Our crypto
      link: "https://x.com/?lang=en&mx=2",
      imgSrc: "./assets/tasks/icon-x.png"
    },
    {
      name: "Instagram",
      title: "Follow us on instagram",
      description: "Follow us on instagram to stay connected and never miss out on the latest updates",
      isComplete: true,
      profitByTibCoin: 500, // Our crypto
      link: "https://www.instagram.com/",
      imgSrc: "./assets/tasks/icon-instagram.png"
    },
  ];

  constructor(
    public dialog: MatDialog,
  ) {}

  public completeTheTask (data: TaskInterface): void {
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

  public toggleTooltip() {
    this.tibCoinInfoTooltip = this.tibCoinInfoTooltip === 'none' ? 'block': 'none'
  }
}
