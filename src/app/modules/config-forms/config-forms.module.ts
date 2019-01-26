import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {FormElementsModule} from '../form-elements/form-elements.module';

import { CoreServicesConfigFormComponent } from './core-services-config-form/core-services-config-form.component';

@NgModule({
  declarations: [
    CoreServicesConfigFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormElementsModule
  ],
  exports: [
    CoreServicesConfigFormComponent
  ]
})
export class ConfigFormsModule { }
