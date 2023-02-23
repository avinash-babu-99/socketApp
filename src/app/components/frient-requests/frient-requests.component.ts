import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ModalDialogService } from 'ngx-modal-dialog';
import { catchError } from 'rxjs';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-frient-requests',
  templateUrl: './frient-requests.component.html',
  styleUrls: ['./frient-requests.component.scss']
})
export class FrientRequestsComponent implements OnInit {

  get friendRequests(): any[] {
    return this.chatService.currentUser.receivedFriendRequests;;
  }

  constructor(public modalService: ModalDialogService, public modalRef: ViewContainerRef, private chatService: ChatService) {
  }

  ngOnInit(): void {
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
        this.chatService.notifyUser(contact)
        this.chatService.refreshUser()
        this.chatService.refreshContactSubject$.next(true);
      });
  }

}
