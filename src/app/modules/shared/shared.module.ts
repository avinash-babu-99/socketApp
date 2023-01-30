import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatInputModule} from '@angular/material/input';

import { OutsideClickListenerDirective } from 'src/app/directives/outside-click-listener.directive';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [OutsideClickListenerDirective],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule
  ],
  exports: [OutsideClickListenerDirective, ReactiveFormsModule, FormsModule, MatInputModule]
})
export class SharedModule { }
