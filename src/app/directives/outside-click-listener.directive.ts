import { Directive, ElementRef, Output, EventEmitter, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appOutsideClickListener]'
})
export class OutsideClickListenerDirective implements OnChanges {

  @Output()clickedOutside: EventEmitter<boolean> = new EventEmitter()
  @Input() toggleTrigger: any

  @HostListener('document:click', ['$event.target'])
  public onClick(event: Event){

    if ( !this.elementRef.nativeElement.contains(event) ) {

      console.log(this.elementRef, 'this.elementRef');


      this.clickedOutside.emit(true)

    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.toggleTrigger, 'toggleTrigger');

  }

  constructor(private elementRef: ElementRef) {

   }

}
