import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ChatService } from '../../services/chat/chat.service';

import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

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
    private http: HttpClient,
    private cookieService: CookieService
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

    if (this.phone && this.password) {
      this.componentStatus = 'loading'
      this.chatService.loginContact({
        phone: this.phone,
        password: this.password
      }).subscribe(
        (data) => {
          if (data && data.user) {

            if (data && data.token) {

              this.cookieService.set('Auth-token', data.token)
            }
            this.chatService.currentUser = data.user
            this.router.navigate(['/Chat/Message'])
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

    this.router.navigate(['/Authenticate/Sign-up'])

  }

}
