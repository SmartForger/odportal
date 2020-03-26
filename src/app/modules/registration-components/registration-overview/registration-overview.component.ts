import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { UserRegistration, StepStatus, UserRegistrationStep, RegistrationApprovalStatus } from 'src/app/models/user-registration.model';
import { FormStatus, ApprovalStatus, Form, Approval, RegistrationSection } from 'src/app/models/form.model';
import { AuthService } from '../../../services/auth.service';
import { UrlGenerator } from '../../../util/url-generator';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { PlatformFormField } from 'src/app/models/platform-form-field.model';
import { Validators } from '@angular/forms';
import * as moment from 'moment';
import { RegistrationUserType } from 'src/app/models/registration.model';
import { ManualSubmissionModalComponent } from '../manual-submission-modal/manual-submission-modal.component';
import { RegistrationManagerService } from 'src/app/services/registration-manager.service';
import { UserRegistrationService } from 'src/app/services/user-registration.service';

@Component({
  selector: 'app-registration-overview',
  templateUrl: './registration-overview.component.html',
  styleUrls: ['./registration-overview.component.scss']
})
export class RegistrationOverviewComponent implements OnInit {
  @Input() formIndex: number;
  @Input() stepIndex: number;
  @Input() 
  get userRegistration(): UserRegistration{return this._userRegistration;}
  set userRegistration(userRegistration: UserRegistration){
    this._userRegistration = userRegistration;
    this.parseRequestedManualForms();
  };
  private _userRegistration: UserRegistration;
  @Input() userType: RegistrationUserType;

  @Output() goToStep: EventEmitter<number>;
  @Output() goToForm: EventEmitter<{step: number, form: number}>;
  @Output() nudgeApprover: EventEmitter<{form: Form, section: RegistrationSection}>;
  @Output() uploadPhysical: EventEmitter<{form: Form, doc: File}>;

  @ViewChild('physicalReplacementInput') physicalUploadEl: ElementRef;

  approvals: Map<string, Array<Approval>>;
  requestedManualForms: Array<Form>;

  constructor(
    private authSvc: AuthService,
    private dialog: MatDialog,
    private regManagerSvc: RegistrationManagerService,
    private userRegSvc: UserRegistrationService
  ) { 
    this.approvals = null;
    this.formIndex = 0;
    this.goToStep = new EventEmitter<number>();
    this.goToForm = new EventEmitter<{step: number, form: number}>();
    this.stepIndex = 0;
    this.nudgeApprover = new EventEmitter<{form: Form, section: RegistrationSection}>();
    this.requestedManualForms = new Array<Form>();
    this.uploadPhysical = new EventEmitter<{form: Form, doc: File}>();
  }

  ngOnInit() {
    this.buildApprovals();
  }

  allowNudge(stepIndex: number, formIndex: number, sectionIndex: number): boolean{
    let form: Form = this.userRegistration.steps[stepIndex].forms[formIndex];
    let section: RegistrationSection = form.layout.sections[sectionIndex];
    if(!section.approval.applicantDefined){return false;}
    if(section.approval.status !== 'incomplete' || form.status !== 'submitted'){return false;}
    return (section.approval.hasOwnProperty('lastContacted') ? moment(new Date()).subtract(1, 'day') > moment(section.approval.lastContacted) : true);
  }

  dispatchGoToForm(step: number, form: number): void{
    this.goToForm.emit({step: step, form: form});
  }

  formatDate(dateStr: string): string{
    const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let date = new Date(parseInt(dateStr));
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  generatePDFLink(filename: string): string {
    return UrlGenerator.generateRegistrationFileUrl(this.authSvc.globalConfig.registrationServiceConnection, filename);
  }

  getBackgroundClass(status: StepStatus | FormStatus | ApprovalStatus): string{
    switch(status){
      case ApprovalStatus.Complete:
      case FormStatus.Complete:
      case StepStatus.Complete: return 'bg-green'
      case StepStatus.Inprogress:
      case FormStatus.Submitted: return 'bg-yellow'
      case ApprovalStatus.Incomplete:
      case FormStatus.Incomplete:
      case StepStatus.Incomplete: 
      default: return 'bg-gray'
    }
  }

  goToActiveForm(): void{
    let step = 0;
    let stepFound = false;
    while(!stepFound && step < this.userRegistration.steps.length){
      if(this.userRegistration.steps[step].status !== StepStatus.Complete){
        stepFound = true;
      }
      else{
        step++;
      }
    }
    if(step >= this.userRegistration.steps.length){
      step = this.userRegistration.steps.length - 1;
    }

    let form = 0;
    let formFound = false;
    while(!formFound){
      if(form === this.userRegistration.steps[step].forms.length){
        if(step + 1 === this.userRegistration.steps.length){
          form = form - 1;
          formFound = true;
        }
        else{
          step++;
          form = 0;
        }
      }
      else if(this.userRegistration.steps[step].forms[form].status === FormStatus.Incomplete){
        formFound = true;
      }
      else{
        form++;
      }
    }
    this.goToForm.emit({step: step, form: form});
  }

  nudge(stepIndex: number, formIndex: number, sectionIndex: number): void{
    let form: Form = this.userRegistration.steps[stepIndex].forms[formIndex];
    let section: RegistrationSection = form.layout.sections[sectionIndex];
    let date = new Date().toISOString();
    console.log(date);
    let fields: Array<PlatformFormField> = [
      {
        type: "static",
        label: "Approver Title",
        defaultValue: section.approval.title
      },
      {
        type: "static",
        label: "Last Contacted (YYYY/MM/DD)",
        defaultValue: section.approval.hasOwnProperty('lastContacted') ? moment(section.approval.lastContacted).format('YYYY/MM/DD') : 'Unknown'
      }
    ];
    if(section.approval.email){
      fields.push({
        type: "static",
        label: "Approver Email",
        defaultValue: section.approval.email
      });
    }
    let confirmationPromptRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: "Nudge Approver",
        subtitle: `Are you sure you want to nudge this approver? If approval is taking longer than expected, please ensure that the contact information below is accurate. If it isn't, you can correct it by editing the approver contact information on the form's page. Otherwise, click Confirm below to renotify your approver.`,
        submitButtonTitle: "Confirm",
        submitButtonClass: "",
        formFields: fields
      }
    });

    confirmationPromptRef.afterClosed().subscribe(data => {
      if(data){
          
      }
    });
  }

  nudgeIconTooltip(approval: Approval): string{
    return `Last Contacted ${approval.hasOwnProperty('lastContacted') ? moment(approval.lastContacted).format('YYYY/MM/DD') : ' - Unknown'}`
  }

  nudgeTooltip(approval: Approval): string{
    if(approval.email){
      return approval.email;
    }
    else{
      return "Nudge Approver";
    }
  }

  onManualSubmission(form: Form, type: 'download' | 'upload'): void{
    let subRef: MatDialogRef<ManualSubmissionModalComponent> = this.dialog.open(ManualSubmissionModalComponent, {
      data: {
        data: form,
        type: type
      },
      panelClass: 'manual-submission-dialog-container'
    });

    subRef.afterClosed().subscribe((result: any) => {
      if (type === 'download' && result) {
        let filename, url;
        if (form.printableForm) {
          filename = form.printableForm.fileName;
          url = UrlGenerator.generateRegistrationPrintableFormUrl(this.authSvc.globalConfig.registrationServiceConnection, filename);
        }
        else {
          filename = form.title;
          url = UrlGenerator.generateRegistrationPrintableFormUrl(this.authSvc.globalConfig.registrationServiceConnection, form.docId);
        }
        fetch(url).then((resp: Response) => resp.blob()).then((blob: Blob) => {
          let objUrl = window.URL.createObjectURL(blob);
          let anchor = document.createElement('a');
          anchor.download = filename;
          anchor.href = objUrl;
          anchor.style.display = 'none';
          document.body.appendChild(anchor);
          anchor.click();
          window.URL.revokeObjectURL(objUrl);
        }).catch((err) => { console.log(err); });
      }
      else if (type === 'upload' && result) {
        let file = result as File;
        if (this.userType === RegistrationUserType.APPLICANT) {
          this.userRegSvc.uploadPhysicalReplacement(
            this.userRegistration.userProfile.id,
            this.userRegistration.docId,
            form.docId,
            file
          ).subscribe((regDoc: UserRegistration) => {
            this.userRegistration = regDoc;
          });
        }
        else {
          this.regManagerSvc.uploadPhysicalReplacement(
            this.userRegistration.docId,
            form.docId,
            file
          ).subscribe((regDoc: UserRegistration) => {
            this.userRegistration = regDoc;
          });
        }
      }
    });
  }

  onViewDocument(form: Form){
    let url = UrlGenerator.generateRegistrationFileUrl(this.authSvc.globalConfig.registrationServiceConnection, form.physicalForm.filename);
    fetch(url).then((resp: Response) => resp.blob()).then((blob: Blob) => {
      let objUrl = window.URL.createObjectURL(blob);
      let anchor = document.createElement('a');
      anchor.download = `${this.userRegistration.bindingRegistry['fullName']} - ${form.title}`;
      anchor.href = objUrl;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      window.URL.revokeObjectURL(objUrl);
    }).catch((err) => console.log(err));
  }
  
  statusAsString(status: StepStatus | FormStatus): string{
    switch(status){
      case FormStatus.Complete:
      case StepStatus.Complete: return 'Complete'
      case StepStatus.Inprogress: return 'In Progress'
      case FormStatus.Submitted: return 'Submitted'
      case FormStatus.Incomplete:
      case StepStatus.Incomplete: return 'Incomplete'
    }
  }
  
  private buildApprovals(): void{
    let approvals = new Map<string, Array<Approval>>();
    this.userRegistration.steps.forEach((step: UserRegistrationStep) => {
      step.forms.forEach((form: Form) => {
        form.layout.sections.forEach((section: RegistrationSection) => {
          if(!approvals.has(form.docId)){
            approvals.set(form.docId, new Array<Approval>());
          }
          
          if(section.approval){
            approvals.get(form.docId).push(section.approval);
          }
        });
      });
    });
    this.approvals = approvals;
  }

  private parseRequestedManualForms(){
    this.requestedManualForms = new Array();
    this.userRegistration.steps.forEach((step: UserRegistrationStep) => {
      step.forms.forEach((form: Form) => {
        if(form.manualWorkflowRequested){
          this.requestedManualForms.push(form);
        }
      });
    });
  }

  private uploadPhysicalCopy(form: Form){
  }
}
