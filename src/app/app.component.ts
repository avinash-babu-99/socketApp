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
  @ViewChild('messageBlock') public messageBlockEle: any;
  public roomId: string = '';
  public messageText: string = '';
  public messageArray: any[];

  public phone: string = '';
  public currentUser: any;
  public selectedUser: any;
  public title = 'socketApp';
  public isLoggedIn: boolean;

  public contactsList: any[];

  public isPhoneNumberWrong: boolean;

  public isViewCheckCall: boolean;

  public isBotModalOpen: boolean;
  public robotMessageModel: string;
  public chatBotMessage: string;

  constructor(private chatService: ChatService) {
    this.isLoggedIn = false;
    this.contactsList = [];
    this.messageArray = [];
    this.isPhoneNumberWrong = false;
    this.isViewCheckCall = false;
    this.isBotModalOpen = false;
    this.robotMessageModel = '';
    this.chatBotMessage = 'Hey!!!!';
  }

  ngOnInit(): void {
    // this.chatService.getMessage().subscribe((data) => {
    //   console.log(data, 'from subject');
    //   this.messageArray.push(data);
    // });

    // this.chatService.getContacts().subscribe(
    //   (data) => {
    //     console.log(data, 'contacts response');
    //   },
    //   (err) => {
    //     console.log(err, 'contact error');
    //   }
    // );

    // this.isViewCheckCall = false;

    // this.scrollToBottom();
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
    // this.roomId = selectedUser.roomId;
    const ids = [selectedUser.id, this.currentUser._id];
    this.chatService.getRoom(ids).subscribe((data) => {
      console.log(data, 'response for get');
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

  public sendMessageToBot(): void {
    this.chatService
      .sendMessageToBot(this.robotMessageModel)
      .subscribe((response) => {
        console.log(response, 'response');

        this.chatBotMessage = response;
        this.robotMessageModel = '';
      });
  }
}
