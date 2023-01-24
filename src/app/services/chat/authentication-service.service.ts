import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    private http: HttpClient
  ) {

  }

  public signUp(payload: signUp): Observable<any> {

    return this.http.post(`${this.boUrl}/contactsAuth/signUp`, payload)

  }
}
