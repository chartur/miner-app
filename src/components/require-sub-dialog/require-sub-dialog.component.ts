import { Component } from '@angular/core';
import {MatDialogContainer, MatDialogContent} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {environment} from "../../environments/environment";
import {TelegramService} from "../../services/telegram.service";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-require-sub-dialog',
  standalone: true,
  imports: [
    MatDialogContainer,
    MatDialogContent,
    MatButton,
    TranslateModule
  ],
  templateUrl: './require-sub-dialog.component.html',
  styleUrl: './require-sub-dialog.component.scss'
})
export class RequireSubDialogComponent {

  constructor(
    private telegramService: TelegramService
  ) {
  }

  public subscribeTgChanel() {
    this.telegramService.openTelegramLink(environment.communityChannelLink)
  }

  public checkSubscription() {
    console.log("Check subscription");
  }
}
