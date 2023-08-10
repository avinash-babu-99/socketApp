import { Injectable, HostListener } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  public screenSize: Number = window.innerWidth;

  public showMenuBarSubject: Subject<any> = new Subject();

  public screenSizeSubject: Subject<number> = new Subject<number>();
  public screenSize$: Observable<number> = this.screenSizeSubject.asObservable();



  constructor() {

  }

}
