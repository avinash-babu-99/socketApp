import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// component imports
import { LoginComponent } from 'src/app/components/login/login.component';
import { SignupComponent } from 'src/app/components/signup/signup.component';

const routes: Routes = [{
  path: 'Login',
  component: LoginComponent
}, {
  path: 'Sign-up',
  component: SignupComponent
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
