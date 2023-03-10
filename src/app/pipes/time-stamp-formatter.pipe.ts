import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeStampFormatter',
})
export class TimeStampFormatterPipe implements PipeTransform {

  transform(date: any): string {

    const inputDate = new Date(date);
    const inputTimestamp = inputDate.getTime();

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    if (inputTimestamp >= startOfToday.getTime() && inputTimestamp < endOfToday.getTime()) {

      const formattedTime = inputDate.toLocaleString('en-IN', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        second: undefined
      });

      return formattedTime

    } else {

      console.log("The timestamp is not within today's date range.");

    }

    return '';
  }

}
