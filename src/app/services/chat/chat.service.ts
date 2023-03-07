import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket | undefined;
  public boUrl = 'http://127.0.0.1:400';
  private url: any = 'http://localhost:3001';
  private boLocalUrl = 'http://localhost:400'
  public isLoggedIn: boolean;
  public currentUser: any;
  public refreshContactSubject$: Subject<any>;
  public profileUrl: string = ''

  private contactUrl = 'http://127.0.0.1:400/contacts';

  constructor(private http: HttpClient) {
    // this.socket = io(this.url, {
    //   transports: ['websocket', 'polling', 'flashsocket'],
    // });
    this.isLoggedIn = false;
    this.currentUser = {};
    this.refreshContactSubject$ = new Subject();
  }

  public connectToSocket(): void {
    this.socket = io(this.url, {
      transports: ['websocket', 'polling', 'flashsocket'],
    });
  }

  public disconnectSocket(): void{
    this.socket?.disconnect()
  }

  public saveUserDetailsInSocket(): void{
    this.socket?.emit('loginDetails', this.currentUser)
  }

  public updateContact(id: any, status: string){
    if ( this.currentUser && this.currentUser.contacts ) {
      this.currentUser.contacts.map((data: any) =>{
        if(data._id === id) {
          data.status === status
        }
      })
    }
  }

  public getContacts(): Observable<any> {

    return this.http.get(this.contactUrl);
  }

  public joinRoom(data: any): void {
    this.socket?.emit('join', data);

    this.socket?.on('hello', (data) => {
    });
  }

  public sendMessage(data: any): any {
    this.saveMessage(data).subscribe(
      () => {
        this.socket?.emit('message', data);
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
    return new Observable<{ user: string; message: string }>((observer) => {
      this.socket?.on('new message', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket?.disconnect();
      };
    });
  }

  public updateContactDetails(): Observable<any> {
    return new Observable<{ user: string; message: string }>((observer) => {

      this.socket?.on('updateContactStatus', (data) => {
        this.updateContact(data?._id, data?.status)
        observer.next(data)
      });

      return () => {
        this.socket?.disconnect();
      };
    });
  }

  public listenToContactOnline(data: any): Observable<any>{
    return new Observable<{ id: string }>((observer) => {
      this.socket?.on('onlineStatus', (data) => {
        observer.next(data._id);
      });

      return () => {
        this.socket?.disconnect();
      };
    });
  }

  public emitStatus(status: string): void{
    this.socket?.emit('goOffline', this.currentUser)

    if(status === 'online'){
      this.socket?.emit('goOnline', this.currentUser)
    } else if(status === 'offline'){
      this.socket?.emit('goOffline', this.currentUser)
    }
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
      this.socket?.emit('bot message', text, (response: any) => {
        observer.next(response);
      });
    });
  }

  public getAddNewFriendsList(): Observable<any> {
    return this.http.post(`${this.boUrl}/contacts/addFriendsList/`, {
      currentUser: this.currentUser,
    });
  }

  public notifyUser(data: any): void {
    this.socket?.emit('notify', { data });
  }

  public listenNotification(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket?.on('new notification', (data: any) => {

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

  public refreshUser(): void {
    if (this.currentUser?._id) {
      this.getContactDetails(this.currentUser._id).subscribe(res =>{
        this.currentUser = res.response

        if (res && res.files && res.files.profile) {

          this.setProfilePicture(res.files.profile)

        }
      })
    }
  }

  public uploadFile (fileFormData: FormData) {
   return this.http.post(`${this.boLocalUrl}/contacts/uploadProfile`, fileFormData)
  }

  public getProfilePhoto () {
   return this.http.get(`${this.boLocalUrl}/contacts/getProfilePhoto/user-${this.currentUser._id}`)
  }

  public setProfilePicture(base64: string) {

    if (base64.length && this.currentUser?.profilePicture?.isProfileUploaded) {

      this.profileUrl = `data:${this.currentUser.profilePicture.mimetype};base64,` + base64

      this.refreshContactSubject$.next(true)

    }
  }
}

