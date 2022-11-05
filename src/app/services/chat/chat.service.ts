import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;
  private url: any = 'http://localhost:3001';

  private contactUrl = 'http://127.0.0.1:400/contacts';

  constructor(private http: HttpClient) {
    this.socket = io(this.url, {
      transports: ['websocket', 'polling', 'flashsocket'],
    });
  }

  public getContacts(): Observable<any> {
    return this.http.get(this.contactUrl);
  }

  public joinRoom(data: any): void {
    this.socket.emit('join', data);
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

  public loginContact(phone: any): Observable<any> {
    return this.http.post('http://127.0.0.1:400/contacts/contactLogin', {
      phone,
    });
  }

  public getChatMessages(roomId: any): Observable<any> {
    return this.http.get(`http://127.0.0.1:400/messages/getMessages/${roomId}`);
  }
}
