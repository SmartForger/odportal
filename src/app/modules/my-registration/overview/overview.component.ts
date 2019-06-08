import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserRegistration, StepStatus, RegistrationStatus } from 'src/app/models/user-registration.model';
import { FormStatus, ApprovalStatus } from 'src/app/models/form.model';

@Component({
  selector: 'app-registration-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  @Input() userRegistration: UserRegistration;
  @Input() activeStepIndex;
  @Input() selectedStepIndex;
  @Input() selectedFormIndex;

  @Output() selectStep: EventEmitter<number>;
  @Output() selectForm: EventEmitter<number>;
  @Output() goToStep: EventEmitter<number>;
  @Output() goToForm: EventEmitter<number>;

  currentStep: number;
  currentPanel: number;
  currentForm: number;

  constructor() { 
    this.activeStepIndex = 0;
    this.currentStep = 0;
    this.currentPanel = 0;
    this.selectStep = new EventEmitter<number>();
    this.selectForm = new EventEmitter<number>();
    this.goToStep = new EventEmitter<number>();
    this.goToForm = new EventEmitter<number>();
  }

  ngOnInit() {
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

    let stepCount = this.userRegistration.steps.length;
    let stepPercent = 100 / stepCount;

    for(let i = 0; i < stepCount; i++){
      if(this.userRegistration.steps[i].status === StepStatus.Complete){
        percent += stepPercent;
      }
      else{
        let formCount = this.userRegistration.steps[i].forms.length;
        let formPercent = stepPercent / formCount;

        for(let j = 0; j < formCount; j++){
          if(this.userRegistration.steps[i].forms[j].status === FormStatus.Complete){
            percent += formPercent;
          }
        }
      }
    }

    return percent;
  }
}
