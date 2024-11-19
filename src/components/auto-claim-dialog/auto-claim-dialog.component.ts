import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatDialogClose, MatDialogContent} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-auto-claim-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatDialogClose,
    MatDialogContent,
    TranslateModule
  ],
  templateUrl: './auto-claim-dialog.component.html',
  styleUrl: './auto-claim-dialog.component.scss'
})
export class AutoClaimDialogComponent {

}
