import {Component, ElementRef, HostListener, inject, ViewChild} from '@angular/core';
import {MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {TelegramService} from "../../services/telegram.service";
import {AsyncPipe} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {Observable} from "rxjs";

@Component({
  selector: 'app-cash-out-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    MatButton,
    MatDialogClose,
    TranslateModule,
    AsyncPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './cash-out-dialog.component.html',
  styleUrl: './cash-out-dialog.component.scss'
})
export class CashOutDialogComponent {

  @ViewChild('infoTooltip') infoTooltip: ElementRef;

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event): void {
    if (!this.infoTooltip.nativeElement.contains(event.target)) {
      this.infoTooltip.nativeElement.style.display = 'none';
    }
  }

  public withdrawTooltipToggle: string = 'none';
  readonly dialogRef = inject(MatDialogRef<CashOutDialogComponent>);
  public disableWithdraw: boolean = true;
  public tooltip: Observable<string>;

  constructor(
    public tgService: TelegramService,
    private translateService: TranslateService
  ) {
    this.tooltip = this.translateService.get('withdraw_info');
  }

  public openQrReader() {
    this.tgService.readQR();
  }

  public openWithdrawTooltip () {
    this.withdrawTooltipToggle = this.withdrawTooltipToggle === 'none' ? 'block' : 'none';
  }

  public validateAmount (event: InputEvent | any): void {
    const inputValue = +event.target.value;

    if (isNaN(inputValue) || !event.target.value || event.target.value === '' || typeof +event.target.value !== 'number') {
      this.disableWithdraw = true
      return
    }
  }

  public sendTransaction () {
  }
}
