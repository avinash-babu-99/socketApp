import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutsideClickListenerDirective } from 'src/app/directives/outside-click-listener.directive';



@NgModule({
  declarations: [OutsideClickListenerDirective],
  imports: [
    CommonModule
  ],
  exports: [OutsideClickListenerDirective]
})
export class SharedModule { }
