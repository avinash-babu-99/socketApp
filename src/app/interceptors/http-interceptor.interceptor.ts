import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';


// services imports
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const jwtToken = this.cookieService.get('Auth-token')

    if( jwtToken ) {

      const cloned = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${jwtToken}`)
      });

      return next.handle(cloned);

    }

    return next.handle(request);

  }
}
