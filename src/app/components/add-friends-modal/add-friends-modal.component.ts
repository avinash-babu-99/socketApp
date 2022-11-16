import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

// service imports
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-add-friends-modal',
  templateUrl: './add-friends-modal.component.html',
  styleUrls: ['./add-friends-modal.component.scss'],
})
export class AddFriendsModalComponent implements OnInit, OnChanges {
  @Input() isModalOpen: boolean;
  @Input() SearchArray: any[];

  @Output() modalStatusEventEmitter: EventEmitter<boolean> = new EventEmitter();

  public addFriendsList: any[];

  constructor(private chatService: ChatService) {
    this.isModalOpen = false;
    this.SearchArray = [];
    this.addFriendsList = [];
    this.modalStatusEventEmitter.emit(false);
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes, 'changes');
    this.getAddFriendsList();
  }

  public getAddFriendsList(): void {
    this.chatService.getAddNewFriendsList(this.SearchArray).subscribe((res) => {
      console.log(this.chatService.currentUser, ' current user');
      if (res?.users) {
        this.addFriendsList = res.users;

        let finalList: any[] = [];
        this.addFriendsList.forEach((contact) => {
          let finalContact = contact;
          if (
            this.chatService.currentUser.receivedFriendRequests.includes(
              contact._id
            )
          ) {
            finalContact.isRequestReceived = true;
          } else {
            finalContact.isRequestReceived = false;
          }

          if (
            this.chatService.currentUser.sentFriendRequests.includes(
              contact._id
            )
          ) {
            finalContact.isRequestSent = true;
          } else {
            finalContact.isRequestSent = false;
          }

          finalList.push(finalContact);
        });

        this.addFriendsList = finalList;
      }
    });
  }

  public notifyPeople(contact: any) {
    let data = {};
    this.chatService.notifyUser(contact);
  }
}
