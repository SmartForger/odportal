import { Component, OnInit } from '@angular/core';
import { BreadcrumbsService } from '../../display-elements/breadcrumbs.service';
import { Breadcrumb } from '../../display-elements/breadcrumb.model';
import { UserRegistration } from 'src/app/models/user-registration.model';
import { RegistrationStatus, StepStatus } from '../../../models/user-registration.model';
import { FormStatus, ApprovalStatus, Form, RegistrationSection } from '../../../models/form.model';
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
      this.userRegistration = ur;
      this.setStepAndForm();
      this.display = 'overview';
    });
  }

  setSelectedStepIndex(stepIndex: number){
    this.selectedStepIndex = stepIndex;
    this.selectedFormIndex = 0;
  }

  goToStep(stepIndex: number){
    this.setSelectedStepIndex(stepIndex);
    this.display = 'steps';
  }

  goToForm(stepAndForm: {step: number, form: number}): void{
    this.selectedStepIndex = stepAndForm.step;
    this.selectedFormIndex = stepAndForm.form;
    this.display = 'steps';
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

  private setStepAndForm(): void{
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
    this.activeStepIndex = step;
    this.selectedStepIndex = step;
    this.selectedFormIndex = form;
  }
}
