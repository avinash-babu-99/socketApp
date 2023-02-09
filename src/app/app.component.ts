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
export class AppComponent implements OnInit,OnDestroy {

  public socket: any


  // @HostListener("window:beforeunload", ["$event"])
  // unloadHandler(event: Event) {
  //   event.preventDefault()
  //  console.log('huoisadasdaddsadadsdadsdads');
  //  console.log('huoisadasdaddsadadsdadsdads');
  // //  this.chatService.getContacts()
  //  this.chatService.emitStatus('offline')
  // // this.socket.emit("goOffline", {test: 'hiiii'})

  // }



  constructor(private router: Router, private route: ActivatedRoute, private cookieService: CookieService, private chatService: ChatService) {

  }


  public ngOnInit(): void {

    window.onbeforeunload =  (e)=> {
      // Emit the socket event
   this.chatService.emitStatus('offline')
   e.preventDefault();
   e.returnValue = "Are you sure you want to refresh the page?";
};



    this.router.events.subscribe(data=>{



    })

  }

  ngOnDestroy(): void {

  }

}
