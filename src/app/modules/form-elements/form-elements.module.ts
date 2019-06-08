import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import { TextInputComponent } from './text-input/text-input.component';
import { CheckboxInputComponent } from './checkbox-input/checkbox-input.component';
import { TextareaInputComponent } from './textarea-input/textarea-input.component';

import {MaterialModule} from '../../material.module';
import { RadioInputComponent } from './radio-input/radio-input.component';
import { FileInputComponent } from './file-input/file-input.component';
import { ChipAutocompleteComponent } from './chip-autocomplete/chip-autocomplete.component';

@NgModule({
  declarations: [
    TextInputComponent,
    CheckboxInputComponent,
    TextareaInputComponent,
    RadioInputComponent,
    FileInputComponent,
    ChipAutocompleteComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    TextInputComponent,
    CheckboxInputComponent,
    TextareaInputComponent,
    RadioInputComponent,
    FileInputComponent,
    ChipAutocompleteComponent
  ]
})
export class FormElementsModule { }
