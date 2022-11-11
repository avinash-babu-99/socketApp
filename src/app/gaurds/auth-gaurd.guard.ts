import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

// service imports
import { ChatService } from '../services/chat/chat.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGaurdGuard implements CanActivate {

  constructor(
    private chatService: ChatService,
    private router: Router
  ) {

  }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.chatService.isLoggedIn) {

      return true;

    } else {

      this.router.navigate(['/login'])

      return false

    }

  }

}
