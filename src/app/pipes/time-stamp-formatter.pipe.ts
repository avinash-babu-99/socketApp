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

    const daysAgo = Math.floor((today.getTime() - inputTimestamp) / (1000 * 60 * 60 * 24));


    if (inputTimestamp >= startOfToday.getTime() && inputTimestamp < endOfToday.getTime()) {

      const formattedTime = inputDate.toLocaleString('en-IN', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        second: undefined
      });

      return formattedTime

    } 
    else if(daysAgo >= 0 && daysAgo < 7){

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayOfWeek = new Date(inputTimestamp).getDay();
      return days[dayOfWeek];

    }
    else {

      const formattedDate = `${inputDate.getDate()}/${inputDate.getMonth() + 1}/${inputDate.getFullYear()}`;
      return formattedDate;

    }

    return '';
  }

}
