import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// component imports
import { ChatMainComponent } from 'src/app/components/chat-main/chat-main.component';
import { ChatAreaComponent } from 'src/app/components/chat-area/chat-area.component';
import { ContactsComponent } from 'src/app/components/contacts/contacts.component';
import { FrientRequestsComponent } from 'src/app/components/frient-requests/frient-requests.component';

const routes: Routes = [
  {
    path: '',
    component: ChatMainComponent,
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
