import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit, OnChanges {
  @ViewChild('modalContainer', { static: true }) modalContainer: ElementRef = {} as ElementRef;

  @Input() isModalopen: boolean
  @Input() actions: any[];

  @Output() actionEmitter: EventEmitter<string> = new EventEmitter();

  constructor(public eleRef: ElementRef) {

    this.isModalopen = false
    this.actions = [
    ]

  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {

    this.toggleModal()

  }


  public toggleModal() {

    const element = this.modalContainer.nativeElement

    if (this.isModalopen) {

      element.style.transform = 'scale(1) translate(-50%,-50%)'

    } else {

      element.style.transform = 'scale(0) translate(-50%,-50%)'

    }

  }

  public emitAction(action: string) {
    this.actionEmitter.emit(action)
  }

}
