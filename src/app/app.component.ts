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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private router: Router, private route: ActivatedRoute, private cookieService: CookieService, private chatService: ChatService) {

  }


  public ngOnInit(): void {
  };


  ngOnDestroy(): void {

  }

}
