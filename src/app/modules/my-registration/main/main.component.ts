import { Component, OnInit } from '@angular/core';
import { BreadcrumbsService } from '../../display-elements/breadcrumbs.service';
import { Breadcrumb } from '../../display-elements/breadcrumb.model';
import { UserRegistration } from 'src/app/models/user-registration.model';
import { RegistrationStatus, StepStatus } from '../../../models/user-registration.model';
import { FormStatus, ApprovalStatus, Form } from '../../../models/form.model';
import { UserRegistrationService } from 'src/app/services/user-registration.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  display: string;
  userRegistration: UserRegistration;
  activeStepIndex: number;
  selectedStepIndex: number;
  selectedFormIndex: number;

  constructor(private crumbsSvc: BreadcrumbsService, private userRegSvc: UserRegistrationService, private authSvc: AuthService) { 
    this.display = 'none';
  }

  ngOnInit() {
    this.generateCrumbs();
    this.userRegSvc.getUserRegistration(this.authSvc.userState.userId).subscribe((ur: UserRegistration) => {
      this.initUserRegistration(ur);
    });
  }

  setSelectedStepIndex(stepIndex: number){
    this.selectedStepIndex = stepIndex;
    this.setSelectedFormIndex()
  }

  goToStep(stepIndex: number){
    this.setSelectedStepIndex(stepIndex);
    this.display = 'steps';
  }

  goToForm(formIndex: number){
    this.selectedFormIndex = formIndex;
    this.display = 'steps';
  }

  submitForm(form: Form){
    this.userRegSvc.submitForm(this.userRegistration.userId, this.userRegistration.docId, form).subscribe((ur: UserRegistration) => {
      this.initUserRegistration(ur);
    });
  }

  private generateCrumbs(): void {
    const crumbs: Array<Breadcrumb> = new Array<Breadcrumb>(
      {
        title: "Dashboard",
        active: false,
        link: "/portal"
      },
      {
        title: "Registration Manager",
        active: true,
        link: "/portal/registration"
      }
    );
    this.crumbsSvc.update(crumbs);
  }

  private initUserRegistration(userRegistration: UserRegistration): void{
    this.userRegistration = userRegistration; 
    this.setActiveStepIndex();
    this.selectedStepIndex = this.activeStepIndex;
    this.setSelectedFormIndex();
    this.display = 'overview';
  }

  private setActiveStepIndex(): void{
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
    this.activeStepIndex = step;
  }

  private setSelectedFormIndex(): void{
    this.selectedFormIndex = 0;
    let formFound = false;
    while(!formFound && this.selectedFormIndex < this.userRegistration.steps[this.selectedStepIndex].forms.length){
      if(this.userRegistration.steps[this.selectedStepIndex].forms[this.selectedFormIndex].status !== FormStatus.Complete){
        formFound = true;
      }
      else{
        this.selectedFormIndex++;
      }
    }

    if(this.selectedFormIndex >= this.userRegistration.steps[this.selectedStepIndex].forms.length){
      this.selectedFormIndex = this.userRegistration.steps[this.selectedStepIndex].forms.length - 1;
    }
  }

}
