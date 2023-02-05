import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ChatService } from '../../services/chat/chat.service';

import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public phone: string = '';
  public password: string = '';
  public isPhoneNumberWrong: boolean;
  public componentStatus: string = 'loaded' || 'loading' || 'error';
  public isPasswordVisible: boolean = false;
  public isRememberMeChecked: boolean;

  constructor(
    private chatService: ChatService,
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService,
    private spinner: NgxSpinnerService
  ) {
    this.isPhoneNumberWrong = false;

    this.isRememberMeChecked = false;
  }

  ngOnInit(): void {
    this.componentStatus = 'loaded';

    if ((localStorage.getItem('rememberTalkrrCred') || '') === 'Y') {
      this.isRememberMeChecked = true;
      const encryptredPassword: any =
        localStorage.getItem('talkrrPassword') || '';
      const phone: any = localStorage.getItem('talkrrUserName') || '';

      const decrypted = CryptoJS.AES.decrypt(
        encryptredPassword,
        'talkrrSecret'
      ).toString(CryptoJS.enc.Utf8);

      if (phone && encryptredPassword) {
        this.phone = phone;

        this.password = decrypted;
      }
    }
  }

  test(): void {
    this.http.get('http://14.97.127.234:3000/houses/list').subscribe((data) => {
      console.log(data, 'data');
    });
  }

  public login() {
    console.log('coming in login');

    this.spinner.show();

    console.log(this.isRememberMeChecked, 'is checked');

    if (this.isRememberMeChecked) {
      localStorage.setItem('talkrrUserName', this.phone);
      localStorage.setItem(
        'talkrrPassword',
        CryptoJS.AES.encrypt(this.password, 'talkrrSecret').toString()
      );
      localStorage.setItem('rememberTalkrrCred', 'Y');
    } else {
      localStorage.removeItem('talkrrUserName');
      localStorage.removeItem('talkrrPassword');
      localStorage.setItem('rememberTalkrrCred', 'N');
    }

    if (this.phone && this.password) {
      this.componentStatus = 'loading';
      this.chatService
        .loginContact({
          phone: this.phone,
          password: this.password,
        })
        .subscribe(
          (data) => {
            this.spinner.hide();
            if (data && data.user) {
              if (data && data.token) {
                this.cookieService.delete(`Auth-token-${data.user.phone}`);

                this.cookieService.set(
                  `Auth-token-${data.user.phone}`,
                  data.token,
                  2
                );
              }

              console.log(data.user, 'data.user');

              this.chatService.currentUser = data.user;
              this.router.navigate(['/Chat/Message']);
            }
            this.componentStatus = 'loaded';
          },
          () => {
            this.isPhoneNumberWrong = true;
            this.spinner.hide();
            setTimeout(() => {
              console.log(1);
              this.isPhoneNumberWrong = false;
            }, 5000);
          }
        );
    }
  }

  public navigationToSignUp() {
    this.router.navigate(['/Authenticate/Sign-up']);
  }
}
