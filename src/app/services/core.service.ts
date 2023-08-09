import { Injectable, HostListener } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  public screenSize: Number = window.innerWidth;

  constructor() { }
}
