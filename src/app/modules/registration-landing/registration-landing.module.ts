import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { MaterialModule } from '../../material.module';
import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { FormValidatorsModule } from '../form-validators/form-validators.module';
import { AppRenderersModule } from '../app-renderers/app-renderers.module';

// Components
import { MainComponent } from './main/main.component';
import { RegistrationLandingComponent } from './registration-landing/registration-landing.component';
import { RegistrationOverviewComponent } from './registration-overview/registration-overview.component';
import { RegistrationAccountTypeComponent } from './registration-account-type/registration-account-type.component';
import { RegistrationBasicInfoComponent } from './registration-basic-info/registration-basic-info.component';

import { CustomPipesModule } from '../custom-pipes/custom-pipes.module';
import { RegistrationManualComponent } from './registration-manual/registration-manual.component';
import { SupportComponent } from './support/support.component';
import { VideoDialogComponent } from './video-dialog/video-dialog.component';
import { ConsentModalComponent } from './consent-modal/consent-modal.component';
import { CommunicationErrorComponent } from './communication-error/communication-error.component';
import { CompatibilityDetailsComponent } from './compatibility-details/compatibility-details.component';

const ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: RegistrationLandingComponent,
      },
      {
        path: 'registration/overview',
        component: RegistrationOverviewComponent,
      },
      {
        path: 'registration/account-type',
        component: RegistrationAccountTypeComponent,
      },
      {
        path: 'registration/basic-info',
        component: RegistrationBasicInfoComponent,
      },
      {
        path: 'registration/manual',
        component: RegistrationManualComponent,
      },
      {
        path: 'support',
        component: SupportComponent
      },
      {
        path: 'registration',
        redirectTo: 'registration/overview',
        pathMatch: 'full',
      }
    ],
  },
];

@NgModule({
  declarations: [
    MainComponent,
    RegistrationLandingComponent,
    RegistrationOverviewComponent,
    RegistrationAccountTypeComponent,
    RegistrationBasicInfoComponent,
    RegistrationManualComponent,
    SupportComponent,
    VideoDialogComponent,
    ConsentModalComponent,
    CommunicationErrorComponent,
    CompatibilityDetailsComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    DisplayElementsModule,
    CustomPipesModule,
    FormValidatorsModule,
    AppRenderersModule,
    RouterModule.forChild(ROUTES),
  ],
  entryComponents: [
    VideoDialogComponent,
    ConsentModalComponent,
    CommunicationErrorComponent,
  ]
})
export class RegistrationLandingModule {}
