import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormElementsModule } from '../form-elements/form-elements.module';
import {ConfigFormsModule} from '../config-forms/config-forms.module';
import {DisplayElementsModule} from '../display-elements/display-elements.module';

import { MainComponent } from './main/main.component';
import { ConfigureSsoComponent } from './configure-sso/configure-sso.component';
import { CreateAdminRoleComponent } from './create-admin-role/create-admin-role.component';
import { CreateUserRoleComponent } from './create-user-role/create-user-role.component';
import { CreateVendorRoleComponent } from './create-vendor-role/create-vendor-role.component';
import { FinalizeComponent } from './finalize/finalize.component';
import { SetupAdminAccountComponent } from './setup-admin-account/setup-admin-account.component';
import { SetupCoreServicesComponent } from './setup-core-services/setup-core-services.component';
import { InstallerComponent } from './installer/installer.component';  

const ROUTES: Routes = [
  {
  	path: '',
  	component: MainComponent
  }	
];

@NgModule({
  declarations: [
    MainComponent, 
    ConfigureSsoComponent, 
    CreateAdminRoleComponent, 
    CreateUserRoleComponent, 
    CreateVendorRoleComponent, 
    FinalizeComponent, 
    SetupAdminAccountComponent, 
    SetupCoreServicesComponent, InstallerComponent
  ],

  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    ReactiveFormsModule,
    FormElementsModule,
    ConfigFormsModule,
    DisplayElementsModule
  ]
})
export class BootstrapperModule { }
