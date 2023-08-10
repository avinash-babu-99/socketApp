import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
  HostListener
} from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ChatService } from './services/chat/chat.service';
import { Socket, io } from 'socket.io-client';
import { CoreService } from './services/core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private router: Router, private route: ActivatedRoute, private cookieService: CookieService, private chatService: ChatService, private coreService: CoreService) {

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.coreService.screenSize = event.target.innerWidth
    this.coreService.screenSizeSubject.next(event.target.innerWidth)
  }


  public ngOnInit(): void {
  };


  ngOnDestroy(): void {

  }

}
