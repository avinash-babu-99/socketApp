import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

// service imports
import { ChatService } from '../services/chat/chat.service';
import { AuthenticationServiceService } from '../services/chat/authentication-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGaurdGuard implements CanActivate, CanLoad, CanActivateChild {

  constructor(
    private chatService: ChatService,
    private router: Router,
    private authenticationServiceService: AuthenticationServiceService
  ) {

  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {


    let token

    token = this.authenticationServiceService.isLoggedIn()

    if (token) {

      return true

    }

    this.router.navigate(['authenticate/login'])

    return false

  }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let token

    token = this.authenticationServiceService.isLoggedIn()


    if (token) {

      return true

    }

    this.router.navigate(['authenticate/login'])

    return false
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    let token

    token = this.authenticationServiceService.isLoggedIn()


    if (token) {

      return true

    }

    this.router.navigate(['authenticate/login'])

    return false  }

}
