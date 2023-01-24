import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// component imports
import { LoginComponent } from './components/login/login.component'
import { SignupComponent } from './components/signup/signup.component';
import { ChatMainComponent } from './components/chat-main/chat-main.component';

//gaurd imports
import { AuthGaurdGuard } from './gaurds/auth-gaurd.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signUp',
    component: SignupComponent
  },
  {
    path: 'chat',
    component: ChatMainComponent,
    canActivate: [AuthGaurdGuard]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
