import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

// Modules
import { MaterialModule } from '../../material.module';
import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { DynamicFormModule } from '../dynamic-form/dynamic-form.module';

// Components
import { MainComponent } from './main/main.component';
import { RegistrationStepsComponent } from './registration-steps/registration-steps.component';
import { OverviewComponent } from './overview/overview.component';

const ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: OverviewComponent
      },
      {
        path: 'steps',
        component: RegistrationStepsComponent
      }
    ]
  }
];

@NgModule({
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ],
  declarations: [MainComponent, RegistrationStepsComponent, OverviewComponent],
  imports: [
    CommonModule,
    DisplayElementsModule,
    MaterialModule,
    DynamicFormModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class MyRegistrationModule {}
