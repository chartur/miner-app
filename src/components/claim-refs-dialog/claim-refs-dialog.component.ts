import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {TelegramService} from "../../services/telegram.service";
import {TranslateModule} from "@ngx-translate/core";
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {RefsProfitDto} from "../../interface/dto/refs-profit.dto";
import {from, map, Observable, of, Subscription, tap} from "rxjs";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {CountSuffPipe} from "../../pipes/count-suff.pipe";
import {RefsStore} from "../../stores/refs-store.service";
import {UiService} from "../../services/ui.service";
import {User} from "../../interface/models/user";

@Component({
  selector: 'app-claim-refs-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    TranslateModule,
    MatButton,
    MatDialogClose,
    AsyncPipe,
    NgForOf,
    NgIf,
    CountSuffPipe
  ],
  templateUrl: './claim-refs-dialog.component.html',
  styleUrl: './claim-refs-dialog.component.scss'
})
export class ClaimRefsDialogComponent implements OnInit, OnDestroy {
  public avatarUrl: string = '/assets/icon-profile-picture.png';
  public total$: Observable<string> = of(this.data.total);
  public users$: Observable<Partial<User>[]> = of(this.data.users).pipe(
    map((users) => users.map((u) => ({
      ...u,
      photoUrl: `${u.photoUrl}?ts=${Date.now()}`
    })))
  );
  private subscription: Subscription = new Subscription();

  constructor(
    private telegramService: TelegramService,
    private refsStore: RefsStore,
    private uiService: UiService,
    public dialogRef: MatDialogRef<ClaimRefsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RefsProfitDto
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.refsStore.successfullyCollected$.subscribe(() => {
        this.uiService.runFireworks();
        this.dialogRef.close();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public onClick () {
    this.refsStore.collectRef();
  }
}
