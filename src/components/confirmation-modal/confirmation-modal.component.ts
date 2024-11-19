import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";
import {WalletStore} from "../../stores/wallet.store";

export interface ConfirmationDialogState {
  cancelBtnColor: string,
  confirmBtnColor: string,
  body: string
}

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [
    MatDialogContent,
    MatButton,
    MatDialogClose,
    TranslateModule
  ],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss'
})
export class ConfirmationModalComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: ConfirmationDialogState,
    private walletStore: WalletStore,
    private dialogRef: MatDialogRef<ConfirmationModalComponent>
  ) {}

  onClick() {
    this.walletStore.disconnectWallet()
    this.dialogRef.close();
  }
}
