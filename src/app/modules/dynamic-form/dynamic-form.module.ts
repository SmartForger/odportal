import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { FormElementsModule } from '../form-elements/form-elements.module';

@NgModule({
  declarations: [DynamicFormComponent],
  exports: [DynamicFormComponent],
  imports: [CommonModule, FormElementsModule]
})
export class DynamicFormModule {}
