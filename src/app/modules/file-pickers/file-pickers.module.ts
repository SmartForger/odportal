import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DragDropFilePickerComponent } from './drag-drop-file-picker/drag-drop-file-picker.component';

import {MaterialModule} from '../../material.module';

@NgModule({
  declarations: [DragDropFilePickerComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    DragDropFilePickerComponent
  ]
})
export class FilePickersModule { }
