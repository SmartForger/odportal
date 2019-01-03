import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

import { BindTextInputComponent } from './bind-text-input/bind-text-input.component';

@NgModule({
  declarations: [
    BindTextInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    BindTextInputComponent
  ]
})
export class InputElementsModule { }
