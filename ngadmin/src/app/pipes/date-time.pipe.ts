import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTime'
})
export class DateTimePipe implements PipeTransform {

  transform(v: any, args?: any): any {

    var value = new Date(v);
    if (value instanceof Date && !isNaN(value.getDate())) {

      var y = value.getFullYear();

      var m = null;
      if ((value.getMonth() + 1) < 10) {
        m = "0" + (value.getMonth() + 1);
      } else {
        m = (value.getMonth() + 1);
      }



      var d = null;
      if (value.getDate() < 10) {
        d = "0" + value.getDate();
      } else {
        d = value.getDate();
      }

      var h = null;
      if (value.getHours() < 10) {
        h = "0" + value.getHours();
      } else {
        h = value.getHours();
      }

      var i = null;
      if (value.getMinutes() < 10) {
        i = "0" + value.getMinutes();
      } else {
        i = value.getMinutes();
      }

      var s = null;
      if (value.getSeconds() < 10) {
        s = "0" + value.getSeconds();
      } else {
        s = value.getSeconds();
      }

      return y + "-" + m + "-" + d + " " + h + ":" + i + ":" + s;

    }

    return 'Brak zdefiniowanej daty publikacji'
  }

}
