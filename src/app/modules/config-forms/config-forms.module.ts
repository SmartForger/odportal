import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {FormElementsModule} from '../form-elements/form-elements.module';

import { CoreServicesConfigFormComponent } from './core-services-config-form/core-services-config-form.component';
import { SsoAdminCredsFormComponent } from './sso-admin-creds-form/sso-admin-creds-form.component';

@NgModule({
  declarations: [
    CoreServicesConfigFormComponent,
    SsoAdminCredsFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormElementsModule
  ],
  exports: [
    CoreServicesConfigFormComponent,
    SsoAdminCredsFormComponent
  ]
})
export class ConfigFormsModule { }
