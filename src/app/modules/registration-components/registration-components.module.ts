import { CommonModule } from '@angular/common';
import { CustomPipesModule } from '../custom-pipes/custom-pipes.module';
import { DisplayElementsModule } from '../display-elements/display-elements.module';
import { FilePickersModule } from '../file-pickers/file-pickers.module';
import { FormElementsModule } from '../form-elements/form-elements.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { NgModule } from '@angular/core';
import { Ng5SliderModule } from 'ng5-slider';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { UtcDatePipe } from '../custom-pipes/utc-date.pipe';

import { ApplicantTableComponent } from './applicant-table/applicant-table.component';
import { ApplicantTableOptionsModalComponent } from './applicant-table-options-modal/applicant-table-options-modal.component';
import { ApproverContactsComponent } from './approver-contacts/approver-contacts.component';
import { AttachmentsCardComponent } from './attachments-card/attachments-card.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { FormCardComponent } from './form-card/form-card.component';
import { ManualSubmissionCardComponent } from './manual-submission-card/manual-submission-card.component';
import { ManualSubmissionModalComponent } from './manual-submission-modal/manual-submission-modal.component';
import { MessageDialogComponent } from '../display-elements/message-dialog/message-dialog.component';
import { RegistrationFilePickerComponent } from './registration-file-picker/registration-file-picker.component';
import { RegistrationOverviewComponent } from './registration-overview/registration-overview.component';
import { RegistrationStepperComponent } from './registration-stepper/registration-stepper.component';
import { WorkflowTableComponent } from './workflow-table/workflow-table.component';

@NgModule({
  providers: [
    UtcDatePipe
  ],
  declarations: [
    ApplicantTableComponent,
    ApplicantTableOptionsModalComponent,
    AttachmentsCardComponent,
    ApproverContactsComponent,
    DynamicFormComponent,
    FormCardComponent,
    ManualSubmissionCardComponent,
    ManualSubmissionModalComponent,
    RegistrationOverviewComponent,
    RegistrationStepperComponent,
    RegistrationFilePickerComponent,
    WorkflowTableComponent
  ],
  imports: [
    CommonModule,
    CustomPipesModule,
    DisplayElementsModule,
    FilePickersModule,
    FormElementsModule,
    FormsModule,
    MaterialModule,
    Ng5SliderModule,
    PdfViewerModule,
    ReactiveFormsModule
  ],
  exports: [
    ApplicantTableComponent,
    ApproverContactsComponent,
    DynamicFormComponent,
    FormCardComponent,
    RegistrationOverviewComponent,
    RegistrationStepperComponent,
    WorkflowTableComponent
  ],
  entryComponents: [
    ApplicantTableOptionsModalComponent,
    ManualSubmissionModalComponent,
    MessageDialogComponent
  ]
})
export class RegistrationComponentsModule { }
