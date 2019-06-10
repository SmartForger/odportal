import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
@Pipe({
  name: 'utcDate'
})
export class UtcDatePipe implements PipeTransform {

  constructor(private datePipe: DatePipe){ }

  transform(value: any, args?: any): any {
    const date = this.stripTimezone(new Date(value));
    return this.datePipe.transform(date, args);
  }

  stripTimezone(dateWithTZ: Date): Date{
    return new Date(
      dateWithTZ.getUTCFullYear(),
      dateWithTZ.getUTCMonth(),
      dateWithTZ.getUTCDate(),
      dateWithTZ.getUTCHours(),
      dateWithTZ.getUTCMinutes(),
      dateWithTZ.getUTCSeconds()
    );
  }
}
