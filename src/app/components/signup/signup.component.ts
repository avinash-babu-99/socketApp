import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { AuthenticationServiceService } from 'src/app/services/chat/authentication-service.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public signUpForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private authenticationServiceService: AuthenticationServiceService,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.signUpForm = this.fb.group({
      userName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    })
   }


   ngOnInit(): void {
    this.cookieService.deleteAll()
   }

  public get userNameValue() : any  {
    return <AbstractControl> this.signUpForm.get('userName')
  }

  public get phoneValue() : any  {
    return <AbstractControl> this.signUpForm.get('phone')
  }

  public get passwordValue() : any  {
    return <AbstractControl> this.signUpForm.get('password')
  }

  public get confirmPasswordValue() : any  {
    return <AbstractControl> this.signUpForm.get('confirmPassword')
  }



  public signUp(){
    console.log(this.signUpForm.getRawValue(), 'sign up form');
    console.log(this.signUpForm, 'sign up form');

    const payload = {
      name: this.userNameValue.value,
      phone: this.phoneValue.value,
      password: this.passwordValue.value,
      confirmPassword: this.confirmPasswordValue.value
    }

    this.authenticationServiceService.signUp(payload).subscribe(data=>{

      let token

      if(data && data.token) {

        token = data.token

      }

      this.cookieService.set(`Auth-token-${data.phone}`, token)

      this.router.navigate(['/chat/Message'])

    })

  }

}
