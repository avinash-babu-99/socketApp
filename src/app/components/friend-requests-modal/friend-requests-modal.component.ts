import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { catchError } from 'rxjs';

import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-friend-requests-modal',
  templateUrl: './friend-requests-modal.component.html',
  styleUrls: ['./friend-requests-modal.component.scss'],
})
export class FriendRequestsModalComponent implements OnInit, OnChanges {
  @Input() isModalOpen: boolean;
  @Input() friendRequests: any[];

  @Output() modalStatusEventEmitter: EventEmitter<boolean> = new EventEmitter();

  constructor(private chatService: ChatService) {
    this.isModalOpen = false;
    this.friendRequests = [];
    this.modalStatusEventEmitter.emit(false);
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.friendRequests);
  }

  public notifyPeople(contact: any) {
    let data = {};
    this.chatService.notifyUser(contact);
  }

  public acceptFriend(contact: any, accept?: boolean): void {
    let finalObject: any = {};
    finalObject = {
      from: {
        _id: this.chatService.currentUser._id,
        toId: contact._id,
      },
      to: {
        _id: contact._id,
        toId: this.chatService.currentUser._id,
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
        console.log('request updated');
        this.notifyPeople(contact);
        this.chatService.refreshContactSubject$.next(true);
      });
  }
}
