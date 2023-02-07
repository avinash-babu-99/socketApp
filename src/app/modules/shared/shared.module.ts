import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatInputModule, } from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { NgxSpinnerModule } from "ngx-spinner";

import { OutsideClickListenerDirective } from 'src/app/directives/outside-click-listener.directive';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';


@NgModule({
  declarations: [OutsideClickListenerDirective],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatCheckboxModule,
    NgxSpinnerModule,
    MatIconModule,
    MatSidenavModule
  ],
  exports: [OutsideClickListenerDirective, ReactiveFormsModule, FormsModule, MatInputModule, MatCheckboxModule, NgxSpinnerModule, MatIconModule, MatSidenavModule]
})
export class SharedModule { }
