import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MaterialModule } from 'src/app/material.module';
import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { LoginManagerComponent } from './login-manager/login-manager.component';
import { EnvironmentsListComponent } from './environments-list/environments-list.component';
import { ListAllEnvironmentsComponent } from './list-all-environments/list-all-environments.component';
import { EditEnvironmentComponent } from './edit-environment/edit-environment.component';
import { ConfigGeneralComponent } from './config-general/config-general.component';
import { SmtpRelayComponent } from './smtp-relay/smtp-relay.component';
import { AppearanceGeneralComponent } from './appearance-general/appearance-general.component';
import { ClassificationBannerComponent } from './classification-banner/classification-banner.component';
import { InfoBannerComponent } from './info-banner/info-banner.component';
import { LandingTextComponent } from './landing-text/landing-text.component';
import { CreateEnvConfigComponent } from './create-env-config/create-env-config.component';
import { EnvironmentCardComponent } from './environment-card/environment-card.component';
import { LandingButtonsComponent } from './landing-buttons/landing-buttons.component';
import { SystemConsentComponent } from './system-consent/system-consent.component';
import { CustomCssComponent } from './custom-css/custom-css.component';


const ROUTES: Routes = [
  {
    path: '',
    component: LoginManagerComponent,
    children: [
      {
        path: 'list',
        component: EnvironmentsListComponent
      },
      {
        path: 'edit/:id',
        component: EditEnvironmentComponent
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      }
    ]
  }
];


@NgModule({
  declarations: [
    LoginManagerComponent,
    EnvironmentsListComponent,
    ListAllEnvironmentsComponent,
    EditEnvironmentComponent,
    ConfigGeneralComponent,
    SmtpRelayComponent,
    AppearanceGeneralComponent,
    ClassificationBannerComponent,
    InfoBannerComponent,
    LandingTextComponent,
    CreateEnvConfigComponent,
    EnvironmentCardComponent,
    LandingButtonsComponent,
    SystemConsentComponent,
    CustomCssComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    MaterialModule,
    DisplayElementsModule,
    FlexLayoutModule,
    RouterModule.forChild(ROUTES)
  ],
  entryComponents: [
    CreateEnvConfigComponent
  ]
})
export class LoginManagerModule { }
