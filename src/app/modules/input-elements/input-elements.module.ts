import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

import { BindTextInputComponent } from './bind-text-input/bind-text-input.component';
import { BindCheckboxInputComponent } from './bind-checkbox-input/bind-checkbox-input.component';
import { BindSelectInputComponent } from './bind-select-input/bind-select-input.component';

import {MaterialModule} from '../../material.module';

@NgModule({
  declarations: [
    BindTextInputComponent,
    BindCheckboxInputComponent,
    BindSelectInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  exports: [
    BindTextInputComponent,
    BindCheckboxInputComponent,
    BindSelectInputComponent
  ]
})
export class InputElementsModule { }
