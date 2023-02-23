import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGaurdGuard } from './gaurds/auth-gaurd.guard';

const routes: Routes = [
  {
    path: 'Authenticate',
    loadChildren: () => import('./modules/authentication/authentication.module').then((m) => {
      return m.AuthenticationModule
    }),
  },
  {
    path: 'Chat',
    loadChildren: () => import('./modules/chat/chat.module').then((m) => {
      return m.ChatModule
    }),
    canActivate : [AuthGaurdGuard],
    canActivateChild: [AuthGaurdGuard]
  },
  { path: '', redirectTo: 'Authenticate', pathMatch: 'full' },
  { path: '**', redirectTo: 'Authenticate', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
