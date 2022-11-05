import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChatService } from './services/chat/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewChecked {
  public roomId: string = '';
  public messageText: string = '';
  public messageArray: any[];
  @ViewChild('messageBlock') public messageBlockEle: any;

  public phone: string = '';
  public currentUser: any;
  public selectedUser: any;
  public title = 'socketApp';
  public isLoggedIn: boolean;

  public contactsList: any[];

  public isPhoneNumberWrong: boolean;

  public isViewCheckCall: boolean;

  constructor(private chatService: ChatService) {
    this.isLoggedIn = false;
    this.contactsList = [];
    this.messageArray = [];
    this.isPhoneNumberWrong = false;
    this.isViewCheckCall = false;
  }

  ngOnInit(): void {
    this.chatService.getMessage().subscribe((data) => {
      console.log(data, 'from subject');
      this.messageArray.push(data);
    });

    this.chatService.getContacts().subscribe(
      (data) => {
        console.log(data, 'contacts response');
      },
      (err) => {
        console.log(err, 'contact error');
      }
    );

    this.isViewCheckCall = false;

    this.scrollToBottom();
  }

  ngAfterViewChecked(): void {
    if (this.isViewCheckCall) {
      this.scrollToBottom();
    }
    // this.isViewCheckCall = false;
  }

  // local requirements
  public login() {
    if (this.phone) {
      this.chatService.loginContact(this.phone).subscribe(
        (data) => {
          if (data && data.user[0]) {
            this.currentUser = data.user[0];
            this.contactsList = this.currentUser.contacts;
            this.isLoggedIn = true;
          }
        },
        () => {
          this.isPhoneNumberWrong = true;
          setTimeout(() => {
            console.log(1);
            this.isPhoneNumberWrong = false;
          }, 5000);
        }
      );
    }
  }

  public selectedUserHandler(selectedUser: any) {
    this.isViewCheckCall = true;
    this.messageArray = [];
    this.selectedUser = selectedUser;
    this.roomId = selectedUser.roomId;
    this.chatService.getChatMessages(this.roomId).subscribe((response) => {
      if (response && response.messages) {
        this.messageArray = [...this.messageArray, ...response.messages];
        console.log(this.messageArray);
        this.scrollToBottom();
        this.join(this.currentUser, this.roomId);
      }
    });
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
}
