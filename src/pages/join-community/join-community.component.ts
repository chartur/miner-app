import { Component } from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-join-community',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './join-community.component.html',
  styleUrl: './join-community.component.scss'
})
export class JoinCommunityComponent {

  loadingSub: boolean = false;


}
