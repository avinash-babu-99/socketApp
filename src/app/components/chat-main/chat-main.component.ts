// Angular imports
import {
  Component,
  OnInit,
  AfterViewChecked,
  ViewChild,
  ElementRef,
  OnDestroy,
  HostListener,
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
export class ChatMainComponent implements OnInit, OnDestroy {
  @ViewChild('messageBlock') public messageBlockEle: any;
  @ViewChild('robotModalTrigger') botModalEleRef: ElementRef = {} as ElementRef;
  @ViewChild('chatListTrigger') chatListEleRef: ElementRef = {} as ElementRef;
  @ViewChild('contactListTrigger') contactListEleRef: ElementRef =
    {} as ElementRef;

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
  public chatDrawOpen: boolean;
  public contactsDrawOpen: boolean;
  public chatSearchText: string;
  public profileUrl: string = '';
  public profilePictureModalOpen: boolean = false;
  public navBarOpen: boolean = false

  constructor(
    public chatService: ChatService,
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
    this.chatDrawOpen = false;
    this.contactsDrawOpen = false;
    this.chatSearchText = '';
  }

  ngOnInit(): void {
    this.profileUrl = this.chatService.profileUrl;

    this.isChatContainerExpanded = false;

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

    this.chatService.updateContactDetails().subscribe((data) => {
      if (this.selectedUser?.contact?._id === data?._id) {
        this.selectedUser.status = data.status;
      }

      this.contactsList.map((contact: any, i: any) => {
        if (data._id === contact?.contact?._id) {
          this.contactsList[i].contact.status = data.status;
        }
      });
    });

    this.chatService.getContacts().subscribe(
      (data) => { },
      (err) => { }
    );

    this.currentUser = this.chatService.currentUser;

    this.contactsList = this.currentUser.contacts;

    this.chatService.refreshContactSubject$.subscribe((data: boolean) => {
      if (data) {
        this.currentUser = this.chatService.currentUser;
        this.contactsList = this.currentUser.contacts;
        this.profileUrl = this.chatService.profileUrl;
        this.receivedFriendRequests =
          this.chatService.currentUser.receivedFriendRequests;
      }
    });
  }

  ngOnDestroy(): void {
    this.chatService.emitStatus('offline');
  }

  public sendMessageToBot(): void {
    this.chatService
      .sendMessageToBot(this.robotMessageModel)
      .subscribe((response) => {
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

          let contactList = [];
          if (this.contactsList) {
            contactList = this.contactsList.map((data) => data.contact);
          }

          let searchArray = [this.currentUser, ...contactList];
          this.addFriendsSearchArray = searchArray;
        }
      });
  }

  public notifyPeople(contact: any) {
    let data = {};
    this.chatService.notifyUser(contact);
  }

  public updateContactInChat(id: any, status: string) {
    if (this.currentUser && this.currentUser.contacts) {
      this.currentUser.contacts.map((data: any) => {
        if (data._id === id) {
          data.status === status;
        }
      });
    }
  }

  public toggleBot(): void {
    if (this.isBotModalOpen) {
      this.isBotModalOpen = false;
    }
  }

  public toggleProfilePictureModal(status: boolean): void {
    this.profilePictureModalOpen = status;
  }
}
