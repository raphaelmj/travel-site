import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tourType'
})
export class TourTypePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return value;
  }

}
