import { Component, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { catchError } from 'rxjs';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  get contactsList() {
    return this.chatService.currentUser.contacts;
  }

  get imageUrls(): any[] {
    return this.chatService.imageUrls;;
  }

  public removeContactActions: any[]
  public isAddFriendsModalOpen: boolean;
  public addFriendsSearchArray: any[]
  public selectedContactToRemove: any

  public isRemoveContactDialogueOpen: boolean

  constructor( public modalRef: ViewContainerRef, public chatService: ChatService) {
    this.isRemoveContactDialogueOpen = false
    this.removeContactActions = [{
      locale: 'Cancel',
      action: 'cancel'
    },
    {
      locale: 'Remove',
      action: 'remove'
    }
    ]
    this.isAddFriendsModalOpen = false
    this.addFriendsSearchArray = []
  }

  ngOnInit(): void {
    // this.contactsList = this.chatService.currentUser.contacts;
  }

  public openDeleteConfirmationdialogue(): void {

    this.isRemoveContactDialogueOpen = true

  }

  public handleModalActions(action: string): void {

    if (action === 'remove') {

      this.removeContact(this.selectedContactToRemove)

    } else if (action === 'cancel') {

      this.isRemoveContactDialogueOpen = false

    }

  }


  public changeAddFriendsModalState(state: boolean): void {
    this.isAddFriendsModalOpen = state;
  }

  public openAddFriendsModal(): void {
    this.isAddFriendsModalOpen = !this.isAddFriendsModalOpen;
  }

  public removeContact(contact: any): void {
    let finalObject: any = {};

    if (contact._id && this.chatService.currentUser._id) {
      finalObject._id = this.chatService.currentUser._id;
      finalObject.contactId = contact.contact._id;

      this.chatService
        .removeFriend(finalObject)
        .pipe(
          catchError((): any => {
            console.log('error removing contact');
          })
        )
        .subscribe((response: any) => {
          this.isRemoveContactDialogueOpen = false
          this.notifyPeople(contact.contact);
          this.chatService.refreshUser()
        });
    }
  }

  public notifyPeople(contact: any) {
    let data = {};
    this.chatService.notifyUser(contact);
  }

  public validateImage(imageUrl: string): any{
    let string = `${imageUrl}`
    if(string.length){
      return true
    } else {
      return false
    }
  }

}
