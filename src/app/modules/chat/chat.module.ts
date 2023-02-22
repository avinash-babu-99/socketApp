import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { SharedModule } from '../shared/shared.module';

import { ChatMainComponent } from 'src/app/components/chat-main/chat-main.component';
import { AddFriendsModalComponent } from 'src/app/components/add-friends-modal/add-friends-modal.component';
import { FriendRequestsModalComponent } from 'src/app/components/friend-requests-modal/friend-requests-modal.component';
import { ChatAreaComponent } from 'src/app/components/chat-area/chat-area.component';
import { ContactsComponent } from 'src/app/components/contacts/contacts.component';
import { FrientRequestsComponent } from 'src/app/components/frient-requests/frient-requests.component';


@NgModule({
  declarations: [ChatMainComponent, AddFriendsModalComponent, FriendRequestsModalComponent, ChatAreaComponent, ContactsComponent, FrientRequestsComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SharedModule
  ]
})
export class ChatModule { }
