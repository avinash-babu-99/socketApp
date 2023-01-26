import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ChatService } from '../../services/chat/chat.service';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public phone: String = '';
  public password: String = '';
  public isPhoneNumberWrong: boolean;
  public componentStatus: string = 'loaded' || 'loading' || 'error'

  constructor(
    private chatService: ChatService,
    private router: Router,
    private http: HttpClient
  ) {

    this.isPhoneNumberWrong = false

  }

  ngOnInit(): void {
    this.componentStatus = 'loaded'
  }

  test(): void {
    this.http.get('http://14.97.127.234:3000/houses/list').subscribe(data => {
      console.log(data, 'data');

    })
  }

  public login() {
    console.log('coming in login');

    if (this.phone) {
      this.componentStatus = 'loading'
      this.chatService.loginContact(this.phone).subscribe(
        (data) => {
          if (data && data.user[0]) {
            // this.currentUser = data.user[0];
            // this.contactsList = this.currentUser.contacts;
            // this.isLoggedIn = true;
            this.chatService.isLoggedIn = true
            this.chatService.currentUser = data.user[0]
            this.router.navigate(['/chat'])
          }
          this.componentStatus = 'loaded'
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

  public navigationToSignUp() {

    this.router.navigate(['/signUp'])

  }

}
