import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormElementsModule } from '../form-elements/form-elements.module';
import {ConfigFormsModule} from '../config-forms/config-forms.module';
import {DisplayElementsModule} from '../display-elements/display-elements.module';
import {InputElementsModule} from '../input-elements/input-elements.module';

import { MainComponent } from './main/main.component';
import { ConfigureSsoComponent } from './configure-sso/configure-sso.component';
import { CreateAdminRoleComponent } from './create-admin-role/create-admin-role.component';
import { CreateUserRoleComponent } from './create-user-role/create-user-role.component';
import { CreateVendorRoleComponent } from './create-vendor-role/create-vendor-role.component';
import { FinalizeComponent } from './finalize/finalize.component';
import { SetupAdminAccountComponent } from './setup-admin-account/setup-admin-account.component';
import { SetupCoreServicesComponent } from './setup-core-services/setup-core-services.component';
import { InstallerComponent } from './installer/installer.component';  
import {RoleConfigFormComponent} from './role-config-form/role-config-form.component';
import { EntryComponent } from './entry/entry.component';
import { AltMainComponent } from './alt-main/alt-main.component';
import { LandingComponent } from './landing/landing.component';
import { SsoConfigFormComponent } from './sso-config-form/sso-config-form.component';
import { ChooseExistingRealmComponent } from './choose-existing-realm/choose-existing-realm.component';
import { AltFinalizeComponent } from './alt-finalize/alt-finalize.component';

const ROUTES: Routes = [
  {
  	path: '',
    component: LandingComponent,
    children: [
      {
        path: 'start',
        component: EntryComponent
      },
      {
        path: 'create',
        component: MainComponent
      },
      {
        path: 'existing',
        component: AltMainComponent
      },
      {
        path: '',
        redirectTo: 'start'
      }
    ]
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
    SetupCoreServicesComponent, 
    InstallerComponent,
    RoleConfigFormComponent,
    EntryComponent,
    AltMainComponent,
    LandingComponent,
    SsoConfigFormComponent,
    ChooseExistingRealmComponent,
    AltFinalizeComponent
  ],

  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    ReactiveFormsModule,
    FormElementsModule,
    ConfigFormsModule,
    DisplayElementsModule,
    InputElementsModule
  ]
})
export class BootstrapperModule { }
