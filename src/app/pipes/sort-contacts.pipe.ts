import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortContacts'
})
export class SortContactsPipe implements PipeTransform {

  transform(contacts: any): any {
    return contacts.sort((a: any, b: any) => {
      const dateA: any = new Date(a.roomId.lastChatted);
      const dateB: any = new Date(b.roomId.lastChatted);
      return dateB.getTime() - dateA.getTime();
    });;
  }

}
