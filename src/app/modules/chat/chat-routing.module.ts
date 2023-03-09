import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// component imports
import { ChatMainComponent } from 'src/app/components/chat-main/chat-main.component';
import { ChatAreaComponent } from 'src/app/components/chat-area/chat-area.component';
import { ContactsComponent } from 'src/app/components/contacts/contacts.component';
import { FrientRequestsComponent } from 'src/app/components/frient-requests/frient-requests.component';
import { SettingsComponent } from 'src/app/components/settings/settings.component';
import { AuthGaurdGuard } from 'src/app/gaurds/auth-gaurd.guard';
import { FeedComponent } from 'src/app/components/feed/feed.component';

const routes: Routes = [
  {
    path: '',
    component: ChatMainComponent,
    canActivateChild: [AuthGaurdGuard],
    children: [
      {
        path: 'message',
        component: ChatAreaComponent
      },
      {
        path: 'contacts',
        component: ContactsComponent
      },
      {
        path: 'friend-requests',
        component: FrientRequestsComponent
      },
      {
        path: 'Settings',
        component: SettingsComponent
      },
      {
        path: 'Social-feed',
        component: FeedComponent
      },
      { path: '', redirectTo: 'message', pathMatch: 'full' },
      { path: '**', redirectTo: 'message', pathMatch: 'full' },
    ]
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
