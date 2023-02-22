import { Component, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalDialogService } from 'ngx-modal-dialog';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  @Input() contactsList: any[] = []

  public removeContactActions: any[]

  public isRemoveContactDialogueOpen: boolean

  constructor(public modalService: ModalDialogService, public modalRef: ViewContainerRef, public chatService: ChatService) {
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
  }

  ngOnInit(): void {
    this.contactsList = this.chatService.currentUser.contacts;
  }

  public openDeleteConfirmationdialogue(): void {

    this.isRemoveContactDialogueOpen = true

  }

  public handleModalActions(action: string): void {

    if (action === 'remove') {

    } else if (action === 'cancel') {

      this.isRemoveContactDialogueOpen = false

    }

  }

}
