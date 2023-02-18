import { Component, OnInit, Input, ViewChild } from '@angular/core';


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

  constructor( private chatService: ChatService) {

    this.chatSearchText = '';
    this.contactsList = [];
    this.selectedUser = {};
    this.currentUser = {}
    this.messageArray = []
    this.messageText = '';
    this.roomId = ''

   }

  ngOnInit(): void {
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


}
