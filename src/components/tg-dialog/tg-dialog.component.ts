import { Component } from '@angular/core';
import {TelegramService} from "../../services/telegram.service";
import {MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {environment} from "../../environments/environment";
import {MatButton} from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-tg-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatDialogClose,
    MatDialogContent,
    TranslateModule
  ],
  templateUrl: './tg-dialog.component.html',
  styleUrl: './tg-dialog.component.scss'
})
export class TgDialogComponent {

  constructor(
    private telegramService: TelegramService,
    public dialogRef: MatDialogRef<TgDialogComponent>
  ) {}

  public onClick () {
    this.telegramService.openTelegramLink(environment.communityChannelLink);
    this.dialogRef.close();
  }
}
