import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ModalDialogService } from 'ngx-modal-dialog';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-frient-requests',
  templateUrl: './frient-requests.component.html',
  styleUrls: ['./frient-requests.component.scss']
})
export class FrientRequestsComponent implements OnInit {

  public friendRequests: any[]

  constructor(public modalService: ModalDialogService, public modalRef: ViewContainerRef, private chatService: ChatService) {
    this.friendRequests = []
  }

  ngOnInit(): void {

    this.friendRequests = this.chatService.currentUser.receivedFriendRequests;

  }

}
