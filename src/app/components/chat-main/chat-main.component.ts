// Angular imports
import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

// Services imports
import { ChatService } from '../../services/chat/chat.service';

@Component({
  selector: 'app-chat-main',
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.scss'],
})
export class ChatMainComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageBlock') public messageBlockEle: any;

  public isBotModalOpen: boolean;
  public chatBotMessage: string;
  public contactsList: any[];
  public messageArray: any[];
  public selectedUser: any;
  public currentUser: any;
  public roomId: any;
  public messageText: string = '';
  public robotMessageModel: string;
  public isAddFriendsModalOpen: boolean;
  public isFriendRequestsModalOpen: boolean;
  public addFriendsSearchArray: any[];
  public receivedFriendRequests: any[];

  constructor(private chatService: ChatService, private router: Router) {
    this.isBotModalOpen = false;
    this.chatBotMessage = '';
    this.contactsList = [];
    this.messageArray = [];
    this.robotMessageModel = '';
    this.isAddFriendsModalOpen = false;
    this.addFriendsSearchArray = [];
    this.receivedFriendRequests = [];
    this.isFriendRequestsModalOpen = false;
  }

  ngOnInit(): void {
    console.log(this.chatService.currentUser, 'currentUser');

    if (this.chatService?.currentUser?.receivedFriendRequests) {
      this.receivedFriendRequests =
        this.chatService.currentUser.receivedFriendRequests;
    }

    this.chatService.getMessage().subscribe((data) => {
      this.messageArray.push(data);
    });

    this.chatService.listenNotification().subscribe((data) => {
      console.log('you are notified');
    });

    this.chatService.getContacts().subscribe(
      (data) => {},
      (err) => {}
    );

    this.currentUser = this.chatService.currentUser;

    this.contactsList = this.currentUser.contacts;

    this.scrollToBottom();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  public selectedUserHandler(selectedUser: any) {
    this.messageArray = [];
    this.selectedUser = selectedUser;
    console.log(selectedUser);

    // this.roomId = selectedUser.roomId;
    const ids = [selectedUser._id, this.currentUser._id];
    this.chatService.getRoom(ids).subscribe((data) => {
      if (data.data && !data.data.length) {
        console.log('room id not available');
        this.chatService.newRoom(ids).subscribe((response) => {
          console.log('new room created', response);
          this.roomId = response.data._id;
          this.chatService
            .getChatMessages(this.roomId)
            .subscribe((response) => {
              if (response && response.messages) {
                this.messageArray = [
                  ...this.messageArray,
                  ...response.messages,
                ];
                console.log(this.messageArray);
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
            console.log(this.messageArray);
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
        // this.isViewCheckCall = false;
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
    console.log('send message', this.currentUser);
    this.chatService.sendMessage({
      sendUser: this.currentUser.phone,
      room: this.roomId,
      message: this.messageText,
    });

    this.scrollToBottom();

    this.messageText = '';
  }

  public sendMessageToBot(): void {
    this.chatService
      .sendMessageToBot(this.robotMessageModel)
      .subscribe((response) => {
        console.log(response, 'response');

        this.chatBotMessage = response;
        this.robotMessageModel = '';
      });
  }

  public logout(): void {
    this.router.navigate(['/login']);
  }

  public changeAddFriendsModalState(state: boolean): void {
    this.isAddFriendsModalOpen = state;
  }

  public changeFriendRequestsModalState(state: boolean): void {
    this.isFriendRequestsModalOpen = state;
  }

  public openAddFriendsModal(): void {
    let searchArray = [this.currentUser, ...this.contactsList];
    this.addFriendsSearchArray = searchArray;
    this.isAddFriendsModalOpen = !this.isAddFriendsModalOpen;
  }

  public openFriendRequestsModal(): void {
    this.isFriendRequestsModalOpen = !this.isFriendRequestsModalOpen;
  }
}
