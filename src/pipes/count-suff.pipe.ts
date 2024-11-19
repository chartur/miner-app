import { Pipe, PipeTransform } from '@angular/core';
import numeral from "numeral";

@Pipe({
  name: 'countSuff',
  standalone: true
})
export class CountSuffPipe implements PipeTransform {

  transform(input: any, args?: string): any {
    var exp, rounded,
      suffixes = ['k', 'M', 'G', 'T', 'P', 'E'];

    if (Number.isNaN(input)) {
      return null;
    }

    if (input < 1000) {
      return input;
    }

    exp = Math.floor(Math.log(input) / Math.log(1000));

    const value = (input / Math.pow(1000, exp));
    return numeral(value).format(args) + suffixes[exp - 1];
  }

}
