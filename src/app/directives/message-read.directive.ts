import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appMessageRead]'
})
export class MessageReadDirective {
  @Input()selectedChat: any

  constructor(private el: ElementRef) { }

  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    console.log('Scroll Event Detected');
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: any) {
    console.log('Key Up Event Detected');
  }

  @HostListener('click', ['$event'])
  onClick(event: any) {
    console.log('Click Event Detected');
  }

}
