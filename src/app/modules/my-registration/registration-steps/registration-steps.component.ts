import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { UserRegistrationService } from 'src/app/services/user-registration.service';
import { UserRegistration } from 'src/app/models/user-registration.model';
import { AuthService } from 'src/app/services/auth.service';
import { StepStatus } from '../../../models/user-registration.model';
import { FormStatus, RegistrationSection } from '../../../models/form.model';
import { MatStepper } from '@angular/material';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Form } from '@angular/forms';
import { ApproverContactsComponent } from '../approver-contacts/approver-contacts.component';

@Component({
  selector: 'app-registration-steps',
  templateUrl: './registration-steps.component.html',
  styleUrls: ['./registration-steps.component.scss']
})
export class RegistrationStepsComponent implements OnInit {
  @Input() userRegistration: UserRegistration;
  @Input('stepIndex')
  get stepIndex(): number{
    if(this.stepper){
      return this.stepper.selectedIndex;
    }
  }
  set stepIndex(stepIndex: number){
    this.stepper.selectedIndex = stepIndex;
  }
  @Input() formIndex: number;

  @Output() goToOverview: EventEmitter<void>;
  @Output() updateUserRegistration: EventEmitter<UserRegistration>;

  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild(ApproverContactsComponent) approverContacts: ApproverContactsComponent;

  constructor(private userRegSvc: UserRegistrationService, private authSvc: AuthService) { 
    this.formIndex = 0;
    this.goToOverview = new EventEmitter<void>();
    this.updateUserRegistration = new EventEmitter<UserRegistration>();
  }

  ngOnInit() { }

  getBgColor(status: FormStatus | StepStatus): string{
    switch(status){
      case StepStatus.Complete:
      case FormStatus.Complete: return 'bg-green'
      case StepStatus.Inprogress:
      case FormStatus.Submitted: return 'bg-yellow'
      case StepStatus.Incomplete:
      case FormStatus.Incomplete: 
      default: return 'bg-gray'
    }
  }

  getIcon(status: FormStatus | StepStatus): string{
    switch(status){
      case StepStatus.Complete:
      case StepStatus.Inprogress:
      case FormStatus.Complete: return 'check'
      case FormStatus.Submitted: return 'edit'
      case StepStatus.Incomplete:
      case FormStatus.Incomplete: return 'assignment'
    }
  }

  submitSection(section: RegistrationSection){
    this.userRegSvc.submitSection(
      this.userRegistration.userProfile.id, 
      this.userRegistration.docId, 
      this.userRegistration.steps[this.stepper.selectedIndex].forms[this.formIndex].docId, 
      section,
      this.approverContacts.getApproverContacts()
    ).subscribe((ur: UserRegistration) => {
      this.updateUserRegistration.emit(ur);
      if(this.formIndex + 1 < this.userRegistration.steps[this.stepper.selectedIndex].forms.length){
        this.formIndex++;
      }
      else if(this.stepper.selectedIndex + 1 < this.userRegistration.steps.length){
        this.stepper.selectedIndex = this.stepper.selectedIndex + 1;
        this.formIndex = 0;
      }
      else{
        this.goToOverview.emit(null);
      }
    });
  }
}
