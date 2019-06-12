import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { UserRegistrationService } from 'src/app/services/user-registration.service';
import { UserRegistration } from 'src/app/models/user-registration.model';
import { AuthService } from 'src/app/services/auth.service';
import { StepStatus } from '../../../models/user-registration.model';
import { FormStatus } from '../../../models/form.model';
import { MatStepper } from '@angular/material';
import { Form } from '@angular/forms';

@Component({
  selector: 'app-registration-stepper',
  templateUrl: './registration-stepper.component.html',
  styleUrls: ['./registration-stepper.component.scss']
})
export class RegistrationStepperComponent implements OnInit {
  @Input() userRegistration: UserRegistration;
  @Input() activeStepIndex: number;
  @Input() selectedStepIndex: number;
  @Input() selectedFormIndex: number;

  @Output() selectStep: EventEmitter<number>;
  @Output() selectForm: EventEmitter<number>;
  @Output() goToOverview: EventEmitter<void>;
  @Output() formSubmitted: EventEmitter<Form>;

  @ViewChild('stepper') stepper: MatStepper;

  formIndex: number;

  constructor(private userRegSvc: UserRegistrationService, private authSvc: AuthService) { 
    this.formIndex = 0;
    this.selectStep = new EventEmitter<number>();
    this.selectForm = new EventEmitter<number>();
    this.goToOverview = new EventEmitter<void>();
    this.formSubmitted = new EventEmitter<Form>();
  }

  ngOnInit() { 
    this.stepper.selectedIndex = this.selectedStepIndex;
    console.log(this.userRegistration.steps[this.selectedStepIndex].forms[this.selectedFormIndex])
  }

  getBgColor(status: FormStatus | StepStatus): string{
    switch(status){
      case StepStatus.Complete:
      case FormStatus.Complete: return 'bg-green'
      case StepStatus.Submitted:
      case FormStatus.Submitted: return 'bg-yellow'
      case StepStatus.Complete:
      case FormStatus.Incomplete: return 'bg-gray'
    }
  }

  getIcon(status: FormStatus | StepStatus): string{
    switch(status){
      case StepStatus.Complete:
      case StepStatus.Submitted:
      case FormStatus.Complete: return 'check'
      case FormStatus.Submitted: return 'edit'
      case StepStatus.Incomplete:
      case FormStatus.Incomplete: return 'assignment'
    }
  }
}
