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
import {MatCardModule} from '@angular/material/card';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import {MatButtonModule} from '@angular/material/button';
import { ProfileUploadComponent } from 'src/app/components/profile-upload/profile-upload.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { TimeStampFormatterPipe } from '../../pipes/time-stamp-formatter.pipe';


@NgModule({
  declarations: [OutsideClickListenerDirective, ConfirmationDialogComponent, ProfileUploadComponent, TimeStampFormatterPipe],
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
    MatButtonModule,
    PickerModule
  ],
  exports: [OutsideClickListenerDirective, ReactiveFormsModule, FormsModule, MatInputModule, MatCheckboxModule, NgxSpinnerModule, MatIconModule, MatSidenavModule, MatBadgeModule, MatMenuModule, MatCardModule, ConfirmationDialogComponent, MatButtonModule, ProfileUploadComponent, PickerModule, TimeStampFormatterPipe]
})
export class SharedModule { }
