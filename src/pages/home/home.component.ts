import { Component } from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {NgIf} from "@angular/common";
import {GameBoardComponent} from "../../components/game-board/game-board.component";
import {NavComponent} from "../../components/navbar/nav.component";

@Component({
  selector: 'app-home',
  standalone: true,
    imports: [
        GameBoardComponent,
        TranslateModule,
        NgIf,
        NavComponent
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor() {
  }

}
