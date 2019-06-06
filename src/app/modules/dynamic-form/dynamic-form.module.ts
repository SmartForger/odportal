import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';

import { FormElementsModule } from '../form-elements/form-elements.module';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';

@NgModule({
  declarations: [DynamicFormComponent],
  exports: [DynamicFormComponent],
  imports: [CommonModule, MatButtonModule, FormElementsModule]
})
export class DynamicFormModule {}
