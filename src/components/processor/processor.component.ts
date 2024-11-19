import {Component} from "@angular/core";

@Component({
  selector: 'app-processor',
  templateUrl: './processor.component.html',
  styleUrls: [
    './processor.component.scss'
  ],
  standalone: true
})
export class ProcessorComponent {
  public static instance = 0;
  instance = ProcessorComponent.instance++;
}
