import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {FormElementsModule} from '../form-elements/form-elements.module';

import { SsoConfigFormComponent } from './sso-config-form/sso-config-form.component';
import { RoleConfigFormComponent } from './role-config-form/role-config-form.component';
import { CoreServicesConfigFormComponent } from './core-services-config-form/core-services-config-form.component';

@NgModule({
  declarations: [
    SsoConfigFormComponent, 
    RoleConfigFormComponent, 
    CoreServicesConfigFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormElementsModule
  ],
  exports: [
    SsoConfigFormComponent,
    RoleConfigFormComponent,
    CoreServicesConfigFormComponent
  ]
})
export class ConfigFormsModule { }
