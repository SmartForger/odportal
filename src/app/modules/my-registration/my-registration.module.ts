import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CustomPipesModule } from '../custom-pipes/custom-pipes.module';
import { UtcDatePipe } from '../custom-pipes/utc-date.pipe';

// Modules
import { MaterialModule } from '../../material.module';
import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { RegistrationComponentsModule } from '../registration-components/registration-components.module';
import { FormElementsModule } from '../form-elements/form-elements.module';

// Components
import { MainComponent } from './main/main.component';
import { RegistrationStepsComponent } from './registration-steps/registration-steps.component';
import { ApproverContactsComponent } from './approver-contacts/approver-contacts.component';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MainComponent
  },
  {
    path: 'steps',
    component: RegistrationStepsComponent
  }
];

@NgModule({
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    },
    UtcDatePipe
  ],
  declarations: [MainComponent, RegistrationStepsComponent, ApproverContactsComponent],
  imports: [
    CommonModule,
    DisplayElementsModule,
    MaterialModule,
    CustomPipesModule,
    RegistrationComponentsModule,
    FormElementsModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class MyRegistrationModule {}
