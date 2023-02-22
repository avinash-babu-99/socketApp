import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { catchError } from 'rxjs';


// service imports
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss']
})
export class ChatAreaComponent implements OnInit {

  @ViewChild('messageBlock') public messageBlockEle: any;

  @Input() contactsList: any[]
  @Input() selectedUser: any;
  @Input() currentUser: any
  @Input() messageArray: any[]

  public chatSearchText: string;
  public messageText: string;
  public roomId: string
  public receivedFriendRequests: any[]
  public addFriendsSearchArray: any[]

  constructor( private chatService: ChatService) {

    this.chatSearchText = '';
    this.contactsList = [];
    this.selectedUser = {};
    this.currentUser = {}
    this.messageArray = []
    this.messageText = '';
    this.roomId = ''
    this.receivedFriendRequests = []
    this.addFriendsSearchArray = []

   }

  ngOnInit(): void {

    if (this.chatService?.currentUser?.receivedFriendRequests) {
      this.receivedFriendRequests =
        this.chatService.currentUser.receivedFriendRequests;
    }

    this.chatService.getMessage().subscribe((data) => {
      this.messageArray.push(data);
    });

    this.chatService.listenNotification().subscribe((data) => {
      this.refreshContacts();
    });

    this.chatService.updateContactDetails().subscribe(data => {

      if(this.selectedUser?.contact?._id === data?._id){

        this.selectedUser.status = data.status
      }

      this.contactsList.map((contact: any, i: any) => {
        if (data._id === contact?.contact?._id) {
          this.contactsList[i].contact.status = data.status
        }
      })

    })

    this.chatService.getContacts().subscribe(
      (data) => { },
      (err) => { }
    );

    this.currentUser = this.chatService.currentUser;

    this.contactsList = this.currentUser.contacts;

    this.chatService.refreshContactSubject$.subscribe((data: boolean) => {

      if (data) {
        this.refreshContacts();
      }
    });

    this.scrollToBottom();
  }

  public selectedUserHandler(selectedUser: any) {
    this.messageArray = [];
    this.selectedUser = selectedUser;

    const ids = [selectedUser?.contact._id, this.currentUser._id];
    this.chatService.getRoom(ids).subscribe((data) => {
      if (data.data && !data.data.length) {
        this.chatService.newRoom(ids).subscribe((response) => {
          this.roomId = response.data._id;
          this.chatService
            .getChatMessages(this.roomId)
            .subscribe((response) => {
              if (response && response.messages) {
                this.messageArray = [
                  ...this.messageArray,
                  ...response.messages,
                ];
                this.scrollToBottom();
                this.join(this.currentUser, this.roomId);
              }
            });
        });
      } else {
        this.roomId = data.data[0]._id;
        this.chatService.getChatMessages(this.roomId).subscribe((response) => {
          if (response && response.messages) {
            this.messageArray = [...this.messageArray, ...response.messages];
            this.scrollToBottom();
            this.join(this.currentUser, this.roomId);
          }
        });
      }
    });
  }

  public scrollToBottom(): void {
    if (this.messageBlockEle) {
      try {
        this.messageBlockEle.nativeElement.scrollTop =
          this.messageBlockEle.nativeElement.scrollHeight;
      } catch {
        console.log('template error');
      }
    }
  }

  public join(userName: any, roomId: any): void {
    this.chatService.joinRoom({
      user: userName,
      room: roomId,
    });
  }

  public sendMessage() {
    this.chatService.sendMessage({
      sendUser: this.currentUser.phone,
      room: this.roomId,
      message: this.messageText,
    });

    this.scrollToBottom();

    this.messageText = '';
  }

  public refreshContacts(): void {
    this.chatService
      .getContactDetails(this.chatService.currentUser._id)
      .pipe(catchError((): any => { }))
      .subscribe((data) => {
        if (data && data.response) {
          this.chatService.currentUser = data.response;

          if (this.chatService?.currentUser?.receivedFriendRequests) {
            this.receivedFriendRequests =
              this.chatService.currentUser.receivedFriendRequests;
          }

          this.currentUser = this.chatService.currentUser;

          this.contactsList = this.currentUser.contacts;

          let contactList = []
          if( this.contactsList ) {

            contactList = this.contactsList.map(data => data.contact
              )
          }

          let searchArray = [this.currentUser, ...contactList];
          this.addFriendsSearchArray = searchArray;
        }
      });
  }


}
