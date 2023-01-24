import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ChatService } from '../../services/chat/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public phone: string = '';
  public isPhoneNumberWrong: boolean;
  public componentStatus: string = 'loaded' || 'loading' || 'error'

  constructor(
    private chatService: ChatService,
    private router: Router
  ) {

    this.isPhoneNumberWrong = false

  }

  ngOnInit(): void {
    this.componentStatus = 'loaded'
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
