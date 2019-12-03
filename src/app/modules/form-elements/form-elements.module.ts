import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { TextInputComponent } from './text-input/text-input.component';
import { CheckboxInputComponent } from './checkbox-input/checkbox-input.component';
import { TextareaInputComponent } from './textarea-input/textarea-input.component';
import { RadioInputComponent } from './radio-input/radio-input.component';
import { FileInputComponent } from './file-input/file-input.component';
import { ChipAutocompleteComponent } from './chip-autocomplete/chip-autocomplete.component';
import { SelectInputComponent } from './select-input/select-input.component';
import { SelectionListComponent } from './selection-list/selection-list.component';
import { DatepickerInputComponent } from './datepicker-input/datepicker-input.component';

@NgModule({
  declarations: [
    TextInputComponent,
    CheckboxInputComponent,
    TextareaInputComponent,
    RadioInputComponent,
    FileInputComponent,
    ChipAutocompleteComponent,
    SelectInputComponent,
    SelectionListComponent,
    DatepickerInputComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    MatMomentDateModule
  ],
  exports: [
    TextInputComponent,
    CheckboxInputComponent,
    TextareaInputComponent,
    RadioInputComponent,
    SelectInputComponent,
    FileInputComponent,
    ChipAutocompleteComponent,
    SelectionListComponent,
    DatepickerInputComponent
  ]
})
export class FormElementsModule { }
