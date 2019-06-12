import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserRegistration, StepStatus } from 'src/app/models/user-registration.model';
import { UserRegistrationService } from 'src/app/services/user-registration.service';
import { UserProfile } from 'src/app/models/user-profile.model';
import { FormStatus } from 'src/app/models/form.model';
import { MatTabGroup } from '@angular/material';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  userRegistration: UserRegistration;
  stepIndex: number;
  formIndex: number;
  activeStepIndex: number;
  private goingToStep: boolean;

  @ViewChild(MatTabGroup) tabs: MatTabGroup;

  constructor(
    private route: ActivatedRoute, 
    private userRegSvc: UserRegistrationService
  ){
    this.userRegistration = null;
    this.stepIndex = 0;
    this.formIndex = 0;
    this.activeStepIndex = 0;
    this.goingToStep = false;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.userRegSvc.getUserRegistration(id).subscribe((ur: UserRegistration) => {
      this.userRegistration = ur;
      this.setStepAndForm();
    });
  }

  setStep(index: number): void{
    this.stepIndex = index;
    this.formIndex = 0;
  }

  setForm(index: number): void{
    this.formIndex = index;
  }

  goToStep(stepIndex: number): void{
    this.stepIndex = stepIndex;
    this.goingToStep = true;
    this.tabs.selectedIndex = stepIndex + 1;
  }

  goToForm(formIndex: number): void{
    this.formIndex = formIndex;
    this.goToStep(this.stepIndex);
  }

  onSelectedIndexChange(index: number): void{
    if(!this.goingToStep){
      this.formIndex = 0;
    }
    else{
      this.goingToStep = false;
    }
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
      if(this.userRegistration.steps[step].forms[form].status === FormStatus.Incomplete){
        formFound = true;
      }
      else if(this.formIndex === this.userRegistration.steps[step].forms.length){
        if(step + 1 === this.userRegistration.steps.length){
          form = form - 1;
          formFound = true;
        }
        else{
          step++;
          form = 0;
        }
      }
      else{
        form++;
      }
    }
    this.activeStepIndex = step;
    this.stepIndex = step;
    this.formIndex = form;
  }
}
