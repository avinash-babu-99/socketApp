import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SharedModule } from './modules/shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChatService } from './services/chat/chat.service';
import { LoginComponent } from './components/login/login.component';
import { ChatMainComponent } from './components/chat-main/chat-main.component';
import { AddFriendsModalComponent } from './components/add-friends-modal/add-friends-modal.component';
import { FriendRequestsModalComponent } from './components/friend-requests-modal/friend-requests-modal.component';
import { OutsideClickListenerDirective } from './directives/outside-click-listener.directive';

@NgModule({
  declarations: [AppComponent, LoginComponent, ChatMainComponent, AddFriendsModalComponent, FriendRequestsModalComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule, SharedModule],
  providers: [ChatService],
  bootstrap: [AppComponent],
})
export class AppModule {}
