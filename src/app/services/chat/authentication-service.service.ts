import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ChatService } from './chat.service';

interface signUp {
  name: String,
  phone: String,
  password: String,
  confirmPassword: String
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationServiceService {

  public boUrl = 'http://127.0.0.1:400';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private chatService: ChatService
  ) {

  }

  public signUp(payload: signUp): Observable<any> {

    return this.http.post(`${this.boUrl}/contactsAuth/signUp`, payload, { observe: 'response', withCredentials: true })

  }

  public isLoggedIn(): Boolean{

    const token = this.cookieService.get(`Auth-token-${this.chatService.currentUser.phone}`)

    if( token ) return true

    return false

  }

}
