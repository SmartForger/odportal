import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { UserRegistrationService } from 'src/app/services/user-registration.service';
import { UserRegistration, RegistrationStatus } from 'src/app/models/user-registration.model';
import { AuthService } from 'src/app/services/auth.service';
import { StepStatus } from '../../../models/user-registration.model';
import { FormStatus, RegistrationSection } from '../../../models/form.model';
import { MatStepper } from '@angular/material';
import { ApproverContactsComponent } from '../approver-contacts/approver-contacts.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-registration-steps',
  templateUrl: './registration-steps.component.html',
  styleUrls: ['./registration-steps.component.scss']
})
export class RegistrationStepsComponent implements AfterViewInit {
  userRegistration: UserRegistration;
  formIndex: number;

  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild(ApproverContactsComponent) approverContacts: ApproverContactsComponent;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private userRegSvc: UserRegistrationService, 
    private authSvc: AuthService, 
    private cdr: ChangeDetectorRef
  ) { 
    this.formIndex = 0;
  }
  ngAfterViewInit() {
    this.userRegSvc.getUserRegistration(this.authSvc.getUserId()).subscribe((ur: UserRegistration) => {
      this.userRegistration = ur;
      this.cdr.detectChanges();
      this.route.queryParamMap.subscribe((params: ParamMap) => {
        if(params.has('step')){
          this.stepper.selectedIndex = Number.parseInt(params.get('step'));
        }
        if(params.has('form')){
          this.formIndex = Number.parseInt(params.get('form'));
        }
      });
    });
  }

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
    if(this.approverContacts.validate()){
      this.userRegSvc.submitSection(
        this.userRegistration.userProfile.id, 
        this.userRegistration.docId, 
        this.userRegistration.steps[this.stepper.selectedIndex].forms[this.formIndex].docId, 
        section,
        this.approverContacts.getApproverContacts()
      ).subscribe((ur: UserRegistration) => {
        this.userRegistration = ur;
        if(this.userRegistration.status === RegistrationStatus.Submitted || this.userRegistration.status === RegistrationStatus.Complete){
            this.router.navigateByUrl('/portal/my-registration?showSubmittedDialog=1');
        }
        else if(this.formIndex + 1 < this.userRegistration.steps[this.stepper.selectedIndex].forms.length){
          this.formIndex++;
        }
        else if(this.stepper.selectedIndex + 1 < this.userRegistration.steps.length){
          this.stepper.selectedIndex = this.stepper.selectedIndex + 1;
          this.formIndex = 0;
        }
        else{
          this.router.navigateByUrl('/portal/my-registration');
        }
      });
    }
  }

  unsubmitSection(section: RegistrationSection){
    this.userRegSvc.unsubmitSection(
      this.userRegistration.userProfile.id,
      this.userRegistration.docId,
      this.userRegistration.steps[this.stepper.selectedIndex].forms[this.formIndex].docId,
      section.title
    ).subscribe((ur: UserRegistration) => {
      this.userRegistration = ur;
    });
  }

  goToOverview(){
    this.router.navigateByUrl('/portal/my-registration');
  }
}
