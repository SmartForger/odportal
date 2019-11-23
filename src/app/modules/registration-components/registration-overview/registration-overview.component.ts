import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserRegistration, StepStatus, UserRegistrationStep } from 'src/app/models/user-registration.model';
import { FormStatus, ApprovalStatus, Form, Approval, RegistrationSection } from 'src/app/models/form.model';
import {AuthService} from '../../../services/auth.service';
import {UrlGenerator} from '../../../util/url-generator';

@Component({
  selector: 'app-registration-overview',
  templateUrl: './registration-overview.component.html',
  styleUrls: ['./registration-overview.component.scss']
})
export class RegistrationOverviewComponent implements OnInit {
  @Input() userRegistration: UserRegistration;
  @Input() stepIndex: number;
  @Input() formIndex: number;
  @Output() goToStep: EventEmitter<number>;
  @Output() goToForm: EventEmitter<{step: number, form: number}>;

  approvals: Map<string, Array<Approval>>;

  constructor(private authSvc: AuthService) { 
    this.stepIndex = 0;
    this.formIndex = 0;
    this.goToStep = new EventEmitter<number>();
    this.goToForm = new EventEmitter<{step: number, form: number}>();
    this.approvals = null;
  }

  ngOnInit() {
    this.buildApprovals();
  }

  generatePDFLink(form: Form): string {
    return UrlGenerator.generateRegistrationFileUrl(this.authSvc.globalConfig.registrationServiceConnection, form.pdf);
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

  formatDate(dateStr: string): string{
    const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let date = new Date(parseInt(dateStr));
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  dispatchGoToForm(step: number, form: number): void{
    this.goToForm.emit({step: step, form: form});
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
}
