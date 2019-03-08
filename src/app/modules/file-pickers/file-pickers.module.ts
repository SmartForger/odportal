import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DragDropFilePickerComponent } from './drag-drop-file-picker/drag-drop-file-picker.component';

@NgModule({
  declarations: [DragDropFilePickerComponent],
  imports: [
    CommonModule
  ],
  exports: [
    DragDropFilePickerComponent
  ]
})
export class FilePickersModule { }
