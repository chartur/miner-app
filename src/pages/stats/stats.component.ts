import { Component } from '@angular/core';
import {NavComponent} from "../../components/navbar/nav.component";

@Component({
  selector: 'app-stats',
  standalone: true,
    imports: [
        NavComponent
    ],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent {

}
