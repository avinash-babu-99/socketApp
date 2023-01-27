import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutsideClickListenerDirective } from 'src/app/directives/outside-click-listener.directive';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [OutsideClickListenerDirective],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [OutsideClickListenerDirective, ReactiveFormsModule, FormsModule]
})
export class SharedModule { }
