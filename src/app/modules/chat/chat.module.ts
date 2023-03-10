import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { SharedModule } from '../shared/shared.module';

import { ChatMainComponent } from 'src/app/components/chat-main/chat-main.component';
import { AddFriendsModalComponent } from 'src/app/components/add-friends-modal/add-friends-modal.component';
import { ChatAreaComponent } from 'src/app/components/chat-area/chat-area.component';
import { ContactsComponent } from 'src/app/components/contacts/contacts.component';
import { FrientRequestsComponent } from 'src/app/components/frient-requests/frient-requests.component';
import { SettingsComponent } from 'src/app/components/settings/settings.component';
import { FeedComponent } from 'src/app/components/feed/feed.component';
import { TimeStampFormatterPipe } from 'src/app/pipes/time-stamp-formatter.pipe';

@NgModule({
  declarations: [ChatMainComponent, AddFriendsModalComponent, ChatAreaComponent, ContactsComponent, FrientRequestsComponent, SettingsComponent, FeedComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SharedModule
  ],
  providers: [TimeStampFormatterPipe]
})
export class ChatModule { }
