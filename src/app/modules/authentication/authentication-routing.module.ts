import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// component imports
import { LoginComponent } from 'src/app/components/login/login.component';
import { SignupComponent } from 'src/app/components/signup/signup.component';
import { AuthMainComponent } from 'src/app/components/auth-main/auth-main.component';
const routes: Routes = [{
  path: '',
  component: AuthMainComponent,
  children: [{
    path: 'Login',
    component: LoginComponent
  },
  {
    path: 'Sign-up',
    component: SignupComponent,
  },
  {
    path: '',
    redirectTo: 'Login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'Login',
    pathMatch: 'full'
  }
  ]
},
{
  path: '**',
  redirectTo: '',
  pathMatch: 'full'
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
