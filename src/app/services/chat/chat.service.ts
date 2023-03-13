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
  public imageUrls: any = {}
  public unReadMessagesCountMapping: any = {}

  private contactUrl = 'http://127.0.0.1:400/contacts';

  constructor(private http: HttpClient) {
    this.isLoggedIn = false;
    this.currentUser = {};
    this.refreshContactSubject$ = new Subject();
  }

  public connectToSocket(): void {
    this.socket = io(this.url, {
      transports: ['websocket', 'polling', 'flashsocket'],
    });
  }

  public disconnectSocket(): void {
    this.socket?.disconnect()
  }

  public saveUserDetailsInSocket(): void {
    this.socket?.emit('loginDetails', this.currentUser)
  }

  public updateContact(id: any, status: string) {
    if (this.currentUser && this.currentUser.contacts) {
      this.currentUser.contacts.map((data: any) => {
        if (data._id === id) {
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

  public listenToMyNotification(): Observable<any> {

    return new Observable<any>((observer) => {
      this.socket?.on('myNotification', (data) => {

        observer.next(data);
      });

      return () => {
        this.socket?.disconnect();
      };
    });

  }

  public sortChats(): void {
    this.currentUser.contacts.sort((a: any, b: any) => {
      const dateA: any = new Date(a.roomId.lastChatted);
      const dateB: any = new Date(b.roomId.lastChatted);
      return dateB.getTime() - dateA.getTime();
    });
  }

  public sendMessage(data: any, selectedContact?: any): any {

    this.saveMessage(data).subscribe(
      (res: any) => {

        this.socket?.emit('message', { ...data, roomData: res.roomData });
        if (selectedContact) {
          this.socket?.emit('notifyContact', {
            type: 'new-message',
            contact: {
              _id: selectedContact.contact._id,
              roomData: res.roomData,
              data
            },

          })
        }
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
    return new Observable<{ user: string; message: string, roomData: any }>((observer) => {
      this.socket?.on('new message', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket?.disconnect();
      };
    });
  }

  public updateContactRoomData(roomData: any): void {
    this.currentUser.contacts = this.currentUser.contacts.map((contact: any) => {
      if (contact && contact.roomId && contact.roomId._id) {

        if ((contact.roomId._id === roomData.roomId)) {

          contact.roomId.lastMessage = {}

          contact.roomId.lastMessage.message = roomData.message

          contact.roomId.lastChatted = roomData.date

        }
      }

      return contact
    })

    this.sortChats()


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

  public listenToContactOnline(data: any): Observable<any> {
    return new Observable<{ id: string }>((observer) => {
      this.socket?.on('onlineStatus', (data) => {
        observer.next(data._id);
      });

      return () => {
        this.socket?.disconnect();
      };
    });
  }

  public emitStatus(status: string): void {
    this.socket?.emit('goOffline', this.currentUser)

    if (status === 'online') {
      this.socket?.emit('goOnline', this.currentUser)
    } else if (status === 'offline') {
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
    let modifiedUser: any = {
      _id: this.currentUser._id
    }

    let contactsPayload = this.currentUser.contacts.map((contact: any) => {
      return {
        contact: {
          _id: contact.contact._id
        }
      }
    })

    modifiedUser.contacts = contactsPayload

    return this.http.post(`${this.boUrl}/contacts/addFriendsList/`, {
      currentUser: modifiedUser,
    });
  }

  public notifyUser(data: any, type?: any): void {
    let finalObject = {
      data,
      type: type && type
    }
    this.socket?.emit('notify', { ...finalObject });
  }

  public listenNotification(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket?.on('new notification', (data: any) => {

        if (data?.data?.data?._id === this.currentUser._id) {
          observer.next(data);
        }
      });
    });
  }

  public getUnreadMessages(roomIds: any[]): Observable<any> {
    return this.http.post(`${this.boLocalUrl}/messages/getUnreadMessages`, {roomIds})
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
      this.getContactDetails(this.currentUser._id).subscribe(res => {
        this.currentUser = res.response

        if (res && res.files && res.files.profile) {

          this.setProfilePicture(res.files.profile)

        }
      })
    }
  }

  public uploadFile(fileFormData: FormData) {
    return this.http.post(`${this.boLocalUrl}/contacts/uploadProfile`, fileFormData)
  }

  public setProfilePicture(base64: string) {

    if (base64 && base64.length && this.currentUser?.profilePicture?.isProfileUploaded) {

      this.profileUrl = `data:${this.currentUser.profilePicture.mimetype};base64,` + base64

      this.refreshContactSubject$.next(true)

    }
  }

  public returnImageUrl(base64: string, fileDetails: any): any {

    if (base64 && base64.length && fileDetails?.isProfileUploaded) {

      let imageUrl = `data:${fileDetails.mimetype};base64,` + base64

      return imageUrl

    }

    return null
  }

  public generateContactsImageUrls(contacts: any): any {

    let contactsPayload: any = []
    contactsPayload = contacts.map((contact: any) => {

      if (contact && contact.profilePicture && contact.profilePicture.isProfileUploaded) {
        return {
          _id: contact._id,
          profilePicture: contact.profilePicture
        }
      }

      return

    })

    this.http.post(`${this.boLocalUrl}/contacts/generateProfilesBase64`, contactsPayload).subscribe((data: any) => {

      let finalUrls: any = {}

      data.res.forEach((contact: any) => {
        if (contact.contact && contact.contact.profilePicture && contact.contact.profilePicture.isProfileUploaded) {

          let imageUrl = this.returnImageUrl(contact.base64, contact.contact.profilePicture)

          finalUrls[contact.contact._id] = imageUrl

        }
      })

      this.imageUrls = { ...this.imageUrls, ...finalUrls }

    })

    if (contacts.length) {
      contacts.forEach((contact: any) => {
        if (contact.profilePicture?.isProfileUploaded) {

        }
      })
    }

  }
}

