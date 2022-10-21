import { Component, OnInit } from '@angular/core';
import { ChatService } from './services/chat/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public roomId: string = '';
  public messageText: string = '';
  public messageArray: any[];

  public phone: string = '';
  public currentUser: any;
  public selectedUser: any;
  public title = 'socketApp';
  public isLoggedIn: boolean;

  public userList = [
    {
      id: 1,
      name: 'Avi',
      phone: '123',
      roomId: {
        2: 'room1',
        3: 'room3',
      },
    },
    {
      id: 2,
      name: 'Arvinth',
      phone: '345',
      roomId: {
        1: 'room1',
        3: 'room4',
      },
    },
    {
      id: 3,
      name: 'Sajid',
      phone: '2321323131',
      roomId: {
        1: 'room3',
        2: 'room4',
      },
    },
  ];

  public contactsList: any[];

  constructor(private chatService: ChatService) {
    this.isLoggedIn = false;
    this.contactsList = [];
    this.messageArray = [];
  }

  ngOnInit(): void {
    this.chatService.getMessage().subscribe((data) => {
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
  }

  // local requirements
  public login() {
    if (this.phone) {
      this.chatService.loginContact(this.phone).subscribe((data) => {
        this.currentUser = data.user[0];
        console.log(data, 'currents user');
        this.contactsList = this.currentUser.contacts;
        this.isLoggedIn = true;
      });
    }
  }

  public selectedUserHandler(selectedUser: any) {
    this.selectedUser = selectedUser;
    this.roomId = selectedUser.roomId;
    this.join(this.currentUser, this.roomId);
  }

  public join(userName: any, roomId: any): void {
    this.chatService.joinRoom({
      user: userName,
      room: roomId,
    });
  }

  public sendMessage() {
    console.log('send message', this.roomId);
    this.chatService.sendMessage({
      sendUser: this.currentUser.name,
      room: this.roomId,
      message: this.messageText,
    });

    this.messageText = '';
  }
  ///
}
