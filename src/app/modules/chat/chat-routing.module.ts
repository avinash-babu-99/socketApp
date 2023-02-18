import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// component imports
import { ChatMainComponent } from 'src/app/components/chat-main/chat-main.component';

const routes: Routes = [
  {
    path: '',
    component: ChatMainComponent
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
