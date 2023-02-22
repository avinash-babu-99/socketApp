import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatInputModule, } from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { NgxSpinnerModule } from "ngx-spinner";

import { OutsideClickListenerDirective } from 'src/app/directives/outside-click-listener.directive';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatBadgeModule} from '@angular/material/badge';
import {MatMenuModule} from '@angular/material/menu';
import { ModalDialogModule } from 'ngx-modal-dialog';
import {MatCardModule} from '@angular/material/card';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [OutsideClickListenerDirective, ConfirmationDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatCheckboxModule,
    NgxSpinnerModule,
    MatIconModule,
    MatSidenavModule,
    MatBadgeModule,
    MatMenuModule,
    MatCardModule,
    ModalDialogModule.forRoot(),
    MatButtonModule
  ],
  exports: [OutsideClickListenerDirective, ReactiveFormsModule, FormsModule, MatInputModule, MatCheckboxModule, NgxSpinnerModule, MatIconModule, MatSidenavModule, MatBadgeModule, MatMenuModule, MatCardModule, ModalDialogModule, ConfirmationDialogComponent, MatButtonModule]
})
export class SharedModule { }
