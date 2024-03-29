import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { catchError } from 'rxjs';

// service imports
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-add-friends-modal',
  templateUrl: './add-friends-modal.component.html',
  styleUrls: ['./add-friends-modal.component.scss'],
})
export class AddFriendsModalComponent implements OnInit, OnChanges {
  get imageUrls(): any[] {
    return this.chatService.imageUrls;;
  }

  @Input() isModalOpen: boolean;
  @Input() SearchArray: any[];
  @Input() contactsList: any[]
  @Input() currentUser: any

  @Output() modalStatusEventEmitter: EventEmitter<boolean> = new EventEmitter();

  public addFriendsList: any[];

  constructor(private chatService: ChatService) {
    this.isModalOpen = false;
    this.SearchArray = [];
    this.addFriendsList = [];
    this.contactsList = [];
    this.modalStatusEventEmitter.emit(false);
  }

  ngOnInit(): void {
    this.chatService.listenNotification().subscribe((data) => {
      this.getAddFriendsList();
    });


  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getAddFriendsList();
  }

  public getAddFriendsList(): void {
    this.chatService.getAddNewFriendsList().subscribe((res) => {
      if (res?.users) {
        this.addFriendsList = res.users;

        let finalList: any[] = [];
        this.addFriendsList.forEach((contact) => {
          let finalContact = contact;

          if (
            contact.receivedFriendRequests.includes(
              this.chatService.currentUser._id
            )
          ) {
            finalContact.isRequestSent = true;
          } else {
            finalContact.isRequestSent = false;
          }

          if (
            contact.sentFriendRequests.includes(
              this.chatService.currentUser._id
            )
          ) {
            finalContact.isRequestReceived = true;
          } else {
            finalContact.isRequestReceived = false;
          }

          finalList.push(finalContact);
        });

        this.addFriendsList = finalList;
      }

      this.setContactsProfiles()
    });
  }

  public notifyPeople(contact: any) {
    let data = {};
    this.chatService.notifyUser(contact);
  }

  public addFriend(contact: any): void {
    let finalObject: any = {};
    finalObject = {
      from: {},
      to: {},
    };
    let fromObject = {
      _id: this.chatService.currentUser._id,
      sentFriendRequests: [
        ...this.chatService.currentUser.sentFriendRequests,
        contact._id,
      ],
    };

    let toObject = {
      _id: contact._id,
      receivedFriendRequests: [
        ...contact.receivedFriendRequests,
        this.chatService.currentUser._id,
      ],
    };

    finalObject.from = fromObject;
    finalObject.to = toObject;

    this.chatService
      .addFriend(finalObject)
      .pipe(
        catchError((): any => {
          console.log('error adding friend');
        })
      )
      .subscribe(() => {
        this.getAddFriendsList();
        this.notifyPeople(contact);
      });
  }

  public acceptFriend(contact: any, accept?: boolean): void {
    let finalObject: any = {};
    finalObject = {
      from: {
        _id: this.chatService.currentUser._id,
      },
      to: {
        _id: contact._id,
      },
    };

    if (accept) {
      finalObject.action = 'accept';
    }

    this.chatService
      .acceptOrRejectFriendRequest(finalObject)
      .pipe(
        catchError((): any => {
          console.log('error updating request');
        })
      )
      .subscribe(() => {
        this.notifyPeople(contact);
        this.chatService.refreshUser()
        this.chatService.refreshContactSubject$.next(true);
      });
  }

  public setContactsProfiles(): void {

    let modifiedContacts = []

    modifiedContacts = this.addFriendsList.map((contact: any)=>{
      return {
        _id: contact._id,
        profilePicture: contact.profilePicture
      }
    })

    this.chatService.generateContactsImageUrls(modifiedContacts)

  }
}
