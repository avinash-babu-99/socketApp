import {
  Directive,
  ElementRef,
  Output,
  EventEmitter,
  HostListener,
  Input,
} from '@angular/core';

@Directive({
  selector: '[appOutsideClickListener]',
})
export class OutsideClickListenerDirective {
  @Output() clickedOutside: EventEmitter<boolean> = new EventEmitter();
  @Input() toggleTrigger: ElementRef = {} as ElementRef;

  @HostListener('document:click', ['$event.target'])
  public onClick(event: Event) {

    if (
      !this.elementRef?.nativeElement?.contains(event) &&
      !this.toggleTrigger?.nativeElement?.contains(event)
    ) {

      this.clickedOutside.emit(true);
    }
  }

  constructor(private elementRef: ElementRef) {}
}
