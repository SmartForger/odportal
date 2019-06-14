import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserRegistration, StepStatus, UserRegistrationStep } from 'src/app/models/user-registration.model';
import { UserRegistrationService } from 'src/app/services/user-registration.service';
import { UserProfile } from 'src/app/models/user-profile.model';
import { FormStatus, RegistrationSection, Form } from 'src/app/models/form.model';
import { MatTabGroup } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { VerificationService } from 'src/app/services/verification.service';
import { RegistrationManagerService } from 'src/app/services/registration-manager.service';

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
    private regManagerSvc: RegistrationManagerService
  ){
    this.userRegistration = null;
    this.formIndex = 0;
    this.goingToStep = false;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.regManagerSvc.getUserRegistration(id).subscribe((ur: UserRegistration) => {
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

  onSubmit(formId: string, section: RegistrationSection): void{
    console.log('onSubmit test');
    if(section.approval){
      this.regManagerSvc.submitSection(this.userRegistration.docId, formId, section)
      .subscribe((ur: UserRegistration) => {
        this.userRegistration = ur;
      });
    }
  }

  getApproverRole(section: RegistrationSection): string{
    if(section.approval && section.approval.roles){
      let roleName: string = null;
      let hasRole: boolean = false;
      let roleIndex: number = 0;
      while(!hasRole && roleIndex < section.approval.roles.length){
        if(true)
        {
          roleName = section.approval.roles[roleIndex];
          hasRole = true;
        }
      }
      if(hasRole){
        return roleName;
      }
      else{
        return null;
      }
    }
    else{
      return null;
    }
  }

  readyForApproval(): boolean{
    let ready = true;
    this.userRegistration.steps.forEach((step: UserRegistrationStep) => {
      if(step.status !== StepStatus.Complete){
        ready = false;
      }
    });
    return ready;
  }

  approveUser(): void{
    if(this.readyForApproval()){
      this.regManagerSvc.approveUser(this.userRegistration.docId).subscribe((ur: UserRegistration) => {
        this.userRegistration = ur;
      });
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
