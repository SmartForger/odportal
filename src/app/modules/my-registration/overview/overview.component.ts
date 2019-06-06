import { Component, OnInit, Input } from '@angular/core';
import { UserRegistration, StepStatus, RegistrationStatus } from 'src/app/models/user-registration.model';
import { FormStatus, ApprovalStatus } from 'src/app/models/form.model';

@Component({
  selector: 'app-registration-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  
  formPanel = 1;

  @Input('registration') 
  set registration(registration: UserRegistration){
    this.reg = registration;
    this.setCurrentStep();
    this.setCurrentForm();
  }
  reg: UserRegistration;

  currentStep: number;
  currentPanel: number;
  currentForm: number;

  constructor() { 
    this.currentStep = 0;
    this.currentPanel = 0;
    this.registration = {
      docId: 'fake-reg-id',
      status: RegistrationStatus.Inprogress,
      userId: 'fake-user-id',
      bindingRegistry: { },
      overview: [ ],
      steps: [
        {
          title: 'Basic Information',
          description: 'Collection of user data such as name, contact, organization and position.',
          status: StepStatus.Complete,
          dateCompleted: '1559762836215',
          forms: [
            {
              docId: 'basic-info-form-id',
              title: 'Basic Information Form',
              createdAt: '1559762791093',
              status: FormStatus.Complete,
              dateSubmitted: '1559762827899',
              dateCompleted: '1559762836215',
              files: [ ],
              layout: {rows: [{columns: [{field: { }}]}]}
            }
          ]
        }, 
        {
          title: 'Required Documents',
          description: 'Important documents for establishing clearance.',
          status: StepStatus.Inprogress,
          forms: [
            {
              docId: 'pcte-saar-id',
              title: 'SAAR DD2875',
              createdAt: '1559763074542',
              status: FormStatus.Complete,
              dateSubmitted: '1559763079395',
              dateCompleted: '1559763083818',
              files: [ ],
              approvals: [
                {
                  title: "Supervisor Verification",
                  binding: '',
                  status: ApprovalStatus.Complete,
                  dateCompleted: '1559763083818',
                  fields: [ ]
                },
                {
                  title: "FSO Verification",
                  binding: '',
                  status: ApprovalStatus.Complete,
                  dateCompleted: '1559763083818',
                  fields: [ ]
                },
                {
                  title: "IOA Verification",
                  binding: '', 
                  status: ApprovalStatus.Complete,
                  dateCompleted: '1559763083818',
                  fields: [ ]
                }
              ],
              layout: {rows: [{columns: [{field: { }}]}]}
            },
            {
              docId: 'pcte-aup-id',
              title: 'Acceptable Use Policy',
              createdAt: '1559763115654',
              status: FormStatus.Submitted,
              dateSubmitted: '1559763119796',
              files: [ ],
              approvals: [
                {
                  title: "Supervisor Verification",
                  binding: '',
                  status: ApprovalStatus.Complete,
                  dateCompleted: '1559763083818',
                  fields: [ ]
                },
                {
                  title: "FSO Verification",
                  binding: '',
                  status: ApprovalStatus.Incomplete,
                  fields: [ ]
                },
                {
                  title: "IOA Verification",
                  binding: '', 
                  status: ApprovalStatus.Incomplete,
                  fields: [ ]
                }
              ],
              layout: {rows: [{columns: [{field: { }}]}]}
            },
            {
              docId: 'pcte-nda-id',
              title: 'PCTE NDA',
              createdAt: '1559763160925',
              status: FormStatus.Incomplete,
              files: [ ],
              approvals: [
                {
                  title: "Supervisor Verification",
                  binding: '',
                  status: ApprovalStatus.Incomplete,
                  fields: [ ]
                },
                {
                  title: "FSO Verification",
                  binding: '',
                  status: ApprovalStatus.Incomplete,
                  fields: [ ]
                },
                {
                  title: "IOA Verification",
                  binding: '', 
                  status: ApprovalStatus.Incomplete,
                  fields: [ ]
                }
              ],
              layout: {rows: [{columns: [{field: { }}]}]}
            }
          ]
        }, {
          title: 'Certifications and CEUs',
          description: 'Provide documentation for any certifications you may have.',
          status: StepStatus.Incomplete,
          forms: [ ]
        }, 
      ] 
    }
  }

  ngOnInit() {
  }

  private setCurrentStep(): void{
    let stepFound: boolean = false;
    let lastCompleteStep = -1;
    let stepIndex = 0;

    while(!stepFound && stepIndex < this.reg.steps.length){
      if(this.reg.steps[stepIndex].status === StepStatus.Complete){
        lastCompleteStep = stepIndex;
      } 
      if(this.reg.steps[stepIndex].status === StepStatus.Inprogress){
        stepFound = true;
      }
      else{
        stepIndex++;
      }
    }

    if(stepFound){
      this.currentStep = stepIndex;
    }
    else if(lastCompleteStep != -1 && lastCompleteStep < this.reg.steps.length - 1){
      this.currentStep = lastCompleteStep + 1;
    }
    else if(lastCompleteStep === this.reg.steps.length - 1){
      this.currentStep = lastCompleteStep;
    }
    else{
      this.currentStep = 0;
    }

    this.currentPanel = this.currentStep;
  }

  setCurrentForm(){
    this.currentForm = 0;
    let formFound = false;
    while(!formFound && this.currentForm < this.reg.steps[this.currentStep].forms.length){
      if(this.reg.steps[this.currentStep].forms[this.currentForm].status === FormStatus.Complete){
        this.currentForm++;
      }
      else{
        formFound = true;
      }
    }
    
    if(this.currentForm === this.reg.steps[this.currentStep].forms.length){
      this.currentForm--;
    }
  }

  setCurrentPanel(index: number){
    this.currentPanel = index;
    this.setCurrentForm();
  }

  statusAsString(status: StepStatus | FormStatus): string{
    switch(status){
      case FormStatus.Complete:
      case StepStatus.Complete: return 'Complete'
      case FormStatus.Submitted: return 'Submitted'
      case StepStatus.Inprogress: return 'In Progress'
      case FormStatus.Incomplete:
      case StepStatus.Incomplete: return 'Incomplete'
    }
  }

  getBackgroundClass(status: StepStatus | FormStatus | ApprovalStatus): string{
    switch(status){
      case ApprovalStatus.Complete:
      case FormStatus.Complete:
      case StepStatus.Complete: return 'bg-green'
      case FormStatus.Submitted:
      case StepStatus.Inprogress: return 'bg-yellow'
      case ApprovalStatus.Incomplete:
      case FormStatus.Incomplete:
      case StepStatus.Incomplete: return 'bg-gray'
    }
  }

  formatDate(dateStr: string): string{
    const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let date = new Date(parseInt(dateStr));
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  getPercent(): number{
    let percent = 0;

    let stepCount = this.reg.steps.length;
    let stepPercent = 100 / stepCount;

    for(let i = 0; i < stepCount; i++){
      if(this.reg.steps[i].status === StepStatus.Complete){
        percent += stepPercent;
      }
      else{
        let formCount = this.reg.steps[i].forms.length;
        let formPercent = stepPercent / formCount;

        for(let j = 0; j < formCount; j++){
          if(this.reg.steps[i].forms[j].status === FormStatus.Incomplete){
            percent += 0.5 * formPercent;
          }
          else if(this.reg.steps[i].forms[j].status === FormStatus.Complete){
            percent += formPercent;
          }
        }
      }
    }

    return percent;
  }
}
