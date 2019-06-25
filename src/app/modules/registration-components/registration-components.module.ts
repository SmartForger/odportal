import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { CustomPipesModule } from '../custom-pipes/custom-pipes.module';
import { UtcDatePipe } from '../custom-pipes/utc-date.pipe';
import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { FormElementsModule } from '../form-elements/form-elements.module';
import { FilePickersModule } from '../file-pickers/file-pickers.module';

import { FormCardComponent } from './form-card/form-card.component';
import { RegistrationStepperComponent } from './registration-stepper/registration-stepper.component';
import { RegistrationOverviewComponent } from './registration-overview/registration-overview.component';
import { ApplicantTableComponent } from './applicant-table/applicant-table.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { RegistrationFilePickerComponent } from './registration-file-picker/registration-file-picker.component';

@NgModule({
  providers: [
    UtcDatePipe
  ],
  declarations: [
    FormCardComponent,
    RegistrationStepperComponent,
    RegistrationOverviewComponent,
    ApplicantTableComponent,
    DynamicFormComponent,
    RegistrationFilePickerComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CustomPipesModule,
    DisplayElementsModule,
    FormElementsModule,
    FilePickersModule
  ],
  exports: [
    FormCardComponent,
    RegistrationStepperComponent,
    RegistrationOverviewComponent,
    ApplicantTableComponent,
    DynamicFormComponent
  ]
})
export class RegistrationComponentsModule { }
