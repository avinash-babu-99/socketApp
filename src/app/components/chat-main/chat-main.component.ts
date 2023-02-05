// Angular imports
import {
  Component,
  OnInit,
  AfterViewChecked,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';

// Services imports
import { ChatService } from '../../services/chat/chat.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-chat-main',
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.scss'],
})
export class ChatMainComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageBlock') public messageBlockEle: any;
  @ViewChild('robotModalTrigger') botModalEleRef: ElementRef = {} as ElementRef;

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
  public isChatContainerExpanded: boolean;

  constructor(
    private chatService: ChatService,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.isBotModalOpen = false;
    this.chatBotMessage = '';
    this.contactsList = [];
    this.messageArray = [];
    this.robotMessageModel = '';
    this.isAddFriendsModalOpen = false;
    this.addFriendsSearchArray = [];
    this.receivedFriendRequests = [];
    this.isFriendRequestsModalOpen = false;
    this.isChatContainerExpanded = false;
  }

  ngOnInit(): void {
    this.isChatContainerExpanded = false;
    console.log(this.chatService.currentUser, 'currentUser');

    if (this.chatService?.currentUser?.receivedFriendRequests) {
      this.receivedFriendRequests =
        this.chatService.currentUser.receivedFriendRequests;
    }

    this.chatService.getMessage().subscribe((data) => {
      this.messageArray.push(data);
    });

    this.chatService.listenNotification().subscribe((data) => {
      this.refreshContacts();
      console.log('you are notified');
    });

    this.chatService.getContacts().subscribe(
      (data) => {},
      (err) => {}
    );

    console.log(this.chatService.currentUser, 'this.chatService.currentUser');

    this.currentUser = this.chatService.currentUser;

    this.contactsList = this.currentUser.contacts;

    console.log(this.contactsList, 'this.contactsList');

    this.chatService.refreshContactSubject$.subscribe((data: boolean) => {
      console.log(data, 'subject from service');

      if (data) {
        this.refreshContacts();
      }
    });

    this.scrollToBottom();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  public selectedUserHandler(selectedUser: any) {
    this.messageArray = [];
    this.selectedUser = selectedUser;
    console.log(selectedUser);

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
    this.cookieService.deleteAll(`Auth-token-${this.currentUser.phone}`);
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

  public removeContact(contact: any): void {
    let finalObject: any = {};

    if (contact._id && this.chatService.currentUser._id) {
      finalObject._id = this.chatService.currentUser._id;
      finalObject.contactId = contact._id;

      this.chatService
        .removeFriend(finalObject)
        .pipe(
          catchError((): any => {
            console.log('error removing contact');
          })
        )
        .subscribe((response: any) => {
          this.refreshContacts();
          this.notifyPeople(contact);
        });
    }
  }

  public refreshContacts(): void {
    this.chatService
      .getContactDetails(this.chatService.currentUser._id)
      .pipe(catchError((): any => {}))
      .subscribe((data) => {
        console.log(data, 'data fro refresh contacts');
        if (data && data.response) {
          this.chatService.currentUser = data.response;

          if (this.chatService?.currentUser?.receivedFriendRequests) {
            this.receivedFriendRequests =
              this.chatService.currentUser.receivedFriendRequests;
          }

          this.currentUser = this.chatService.currentUser;

          this.contactsList = this.currentUser.contacts;

          let searchArray = [this.currentUser, ...this.contactsList];
          this.addFriendsSearchArray = searchArray;
        }
      });
  }

  public notifyPeople(contact: any) {
    let data = {};
    this.chatService.notifyUser(contact);
  }

  public toggleBot(): void {
    if (this.isBotModalOpen) {
      this.isBotModalOpen = false;
    }
  }
}
