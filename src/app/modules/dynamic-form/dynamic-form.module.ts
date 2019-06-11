import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';
import { MatButtonToggleModule } from '@angular/material';

import { FormElementsModule } from '../form-elements/form-elements.module';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { FilePickersModule } from '../file-pickers/file-pickers.module';

@NgModule({
  declarations: [DynamicFormComponent],
  exports: [DynamicFormComponent],
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatButtonToggleModule,
    FormElementsModule, 
    DisplayElementsModule,
    FilePickersModule
  ]
})
export class DynamicFormModule {}
