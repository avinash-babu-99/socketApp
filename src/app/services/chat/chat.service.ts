import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;
  public boUrl = 'http://127.0.0.1:400';
  private url: any = 'http://localhost:3001';
  private boLocalUrl = 'http://localhost:400'
  public isLoggedIn: boolean;
  public currentUser: any;
  public refreshContactSubject$: Subject<any>;

  private contactUrl = 'http://127.0.0.1:400/contacts';

  constructor(private http: HttpClient) {
    this.socket = io(this.url, {
      transports: ['websocket', 'polling', 'flashsocket'],
    });
    this.isLoggedIn = false;
    this.currentUser = {};
    this.refreshContactSubject$ = new Subject();
  }

  public getContacts(): Observable<any> {
    return this.http.get(this.contactUrl);
  }

  public joinRoom(data: any): void {
    this.socket.emit('join', data);

    this.socket.on('hello', (data) => {
      console.log('hello event received');
    });
  }

  public sendMessage(data: any): any {
    console.log('send message service');
    this.saveMessage(data).subscribe(
      () => {
        this.socket.emit('message', data);
      },
      () => {
        console.error('error sending message');
      }
    );
  }

  public saveMessage(data: any): Observable<any> {
    return this.http.post('http://127.0.0.1:400/messages/sendMessage', {
      data,
    });
  }

  public getMessage(): Observable<any> {
    console.log('service get message');
    return new Observable<{ user: string; message: string }>((observer) => {
      this.socket.on('new message', (data) => {
        console.log('new message coming in');
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
  }

  getStorage() {
    const storage = localStorage.getItem('chats');
    return storage ? JSON.parse(storage) : [];
  }

  setStorage(data: any) {
    localStorage.setItem('chats', JSON.stringify(data));
  }

  public loginContact(payload: any): Observable<any> {
    return this.http.post('http://127.0.0.1:400/contactsAuth/login', {
      ...payload
    });
  }

  public getChatMessages(roomId: any): Observable<any> {
    return this.http.get(`http://127.0.0.1:400/messages/getMessages/${roomId}`);
  }

  public getRoom(ids: any[]): Observable<any> {
    console.log(ids, 'ids');
    return this.http.get(`${this.boUrl}/rooms/getRoom`, {
      params: {
        ids: [...ids],
      },
    });
  }

  public newRoom(ids: any[]): Observable<any> {
    return this.http.post(`${this.boUrl}/rooms/newRoom/`, { users: [...ids] });
  }

  public sendMessageToBot(text: string): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.emit('bot message', text, (response: any) => {
        observer.next(response);
      });
    });
  }

  public getAddNewFriendsList(searchArray: string[]): Observable<any> {
    return this.http.post(`${this.boUrl}/contacts/addFriendsList/`, {
      searchArray,
    });
  }

  public notifyUser(data: any): void {
    this.socket.emit('notify', { data });
  }

  public listenNotification(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('new notification', (data: any) => {
        console.log('new notification received in service');
        console.log(data, 'new notification data received in service');
        console.log(data?.data?.data?._id);
        console.log(this.currentUser._id);

        if (data?.data?.data?._id === this.currentUser._id) observer.next(data);
      });
    });
  }

  public addFriend(payload: any): Observable<any> {
    return this.http.patch(`${this.boUrl}/contacts/addFriendRequest/`, payload);
  }

  public acceptOrRejectFriendRequest(payload: any): Observable<any> {
    return this.http.patch(
      `${this.boUrl}/contacts/acceptOrRejectFriendRequest`,
      payload
    );
  }

  public removeFriend(payload: any): Observable<any> {
    return this.http.patch(`${this.boUrl}/contacts/removeContact`, payload);
  }

  public getContactDetails(id: String): Observable<any> {

    return this.http.get(`${this.boLocalUrl}/contacts/${id}`);

  }
}

