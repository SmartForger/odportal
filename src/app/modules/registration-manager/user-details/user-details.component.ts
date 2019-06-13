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
  formIndex: number;
  allStepsComplete: boolean;
  private goingToStep: boolean;

  @ViewChild(MatTabGroup) tabs: MatTabGroup;

  constructor(
    private route: ActivatedRoute, 
    private userRegSvc: UserRegistrationService
  ){
    this.userRegistration = null;
    this.formIndex = 0;
    this.goingToStep = false;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.userRegSvc.getUserRegistration(id).subscribe((ur: UserRegistration) => {
      this.userRegistration = ur;
      this.tabs.selectedIndex = 0;
      this.setAllStepsComplete();
    });
  }

  setForm(index: number): void{
    this.formIndex = index;
  }

  goToStep(stepIndex: number): void{
    this.goingToStep = true;
    this.tabs.selectedIndex = stepIndex + 1;
  }

  goToForm(stepAndForm: {step: number, form: number}): void{
    this.goingToStep = true;
    this.tabs.selectedIndex = stepAndForm.step + 1;
    this.formIndex = stepAndForm.form;
  }

  onSelectedIndexChange(index: number): void{
    if(!this.goingToStep){
      this.formIndex = 0;
    }
    else{
      this.goingToStep = false;
    }
  }

  private setAllStepsComplete(): void{
    let allStepsComplete = true;
    let stepIndex = 0;
    while(allStepsComplete && stepIndex < this.userRegistration.steps.length){
      if(this.userRegistration.steps[stepIndex]){
        allStepsComplete = false;
      }
      stepIndex++;
    }
    this.allStepsComplete = allStepsComplete;
  }
}
