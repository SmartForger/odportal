import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

import { BindTextInputComponent } from './bind-text-input/bind-text-input.component';
import { BindCheckboxInputComponent } from './bind-checkbox-input/bind-checkbox-input.component';

@NgModule({
  declarations: [
    BindTextInputComponent,
    BindCheckboxInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    BindTextInputComponent,
    BindCheckboxInputComponent
  ]
})
export class InputElementsModule { }
