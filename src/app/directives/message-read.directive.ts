import { Directive, HostListener, ElementRef, Input, OnChanges } from '@angular/core';
import { ChatService } from '../services/chat/chat.service';

@Directive({
  selector: '[appMessageRead]'
})
export class MessageReadDirective implements OnChanges {
  @Input()selectedChat: any


  constructor(
    private el: ElementRef,
    private chatService: ChatService
    ) { }

  public ngOnChanges(){

    this.chatService.unReadMessagesCountMapping[this.selectedChat?.roomId?._id] = 0

  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    if ( this.chatService.unReadMessagesCountMapping[this.selectedChat?.roomId?._id] ) {

      this.chatService.handleReadMessages(this.selectedChat)

      this.chatService.unReadMessagesCountMapping[this.selectedChat?.roomId?._id] = 0

    }
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: any) {
    if ( this.chatService.unReadMessagesCountMapping[this.selectedChat?.roomId?._id] ) {

      this.chatService.handleReadMessages(this.selectedChat)

      this.chatService.unReadMessagesCountMapping[this.selectedChat?.roomId?._id] = 0
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: any) {

    if ( this.chatService.unReadMessagesCountMapping[this.selectedChat?.roomId?._id] ) {

      this.chatService.handleReadMessages(this.selectedChat)

      this.chatService.unReadMessagesCountMapping[this.selectedChat?.roomId?._id] = 0
    }

  }

}
