import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { AuthenticationServiceService } from 'src/app/services/chat/authentication-service.service';
import { CookieService } from 'ngx-cookie-service';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, AfterViewInit {

  public signUpForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private authenticationServiceService: AuthenticationServiceService,
    private router: Router,
    private cookieService: CookieService,
    private chatService: ChatService
  ) {
    this.signUpForm = this.fb.group({
      userName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    })
  }


  ngOnInit(): void {
    // this.cookieService.deleteAll()
    // this.chatService.emitStatus("offline")
    this.chatService.disconnectSocket()

  }

  ngAfterViewInit(): void {
    this.signUpForm.reset()
  }

  public get userNameValue(): AbstractControl {
    return <AbstractControl>this.signUpForm.get('userName')
  }

  public get phoneValue(): AbstractControl {
    return <AbstractControl>this.signUpForm.get('phone')
  }

  public get passwordValue(): AbstractControl {
    return <AbstractControl>this.signUpForm.get('password')
  }

  public get confirmPasswordValue(): AbstractControl {
    return <AbstractControl>this.signUpForm.get('confirmPassword')
  }



  public signUp() {

    const payload = {
      name: this.userNameValue.value,
      phone: this.phoneValue.value,
      password: this.passwordValue.value,
      confirmPassword: this.confirmPasswordValue.value
    }

    this.authenticationServiceService.signUp(payload).subscribe(data => {

      let token

      if (data && data.token) {

        token = data.token

      }

      this.cookieService.delete(`Auth-token-${data.phone}`)

      this.cookieService.set(`Auth-token-${data.phone}`, token, 2)

      this.router.navigate(['/Chat/Message'])

    })

  }

}
