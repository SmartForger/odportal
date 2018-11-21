import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import { TextInputComponent } from './text-input/text-input.component';
import { CheckboxInputComponent } from './checkbox-input/checkbox-input.component';
import { NumberInputComponent } from './number-input/number-input.component';
import { TextareaInputComponent } from './textarea-input/textarea-input.component';
import { SelectInputComponent } from './select-input/select-input.component';

@NgModule({
  declarations: [TextInputComponent, CheckboxInputComponent, NumberInputComponent, TextareaInputComponent, SelectInputComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    TextInputComponent,
    CheckboxInputComponent,
    NumberInputComponent,
    TextareaInputComponent,
    SelectInputComponent
  ]
})
export class FormElementsModule { }
