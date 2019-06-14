import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserRegistration, StepStatus } from 'src/app/models/user-registration.model';
import { UserRegistrationService } from 'src/app/services/user-registration.service';
import { UserProfile } from 'src/app/models/user-profile.model';
import { FormStatus, RegistrationSection, Form } from 'src/app/models/form.model';
import { MatTabGroup } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { VerificationService } from 'src/app/services/verification.service';

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
    private authSvc: AuthService,
    private userRegSvc: UserRegistrationService,
    private verSvc: VerificationService
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

  onSubmit(stepIndex: number, formIndex: number, section: RegistrationSection): void{
    if(section.approval){
      if(section.approval.email === this.authSvc.userState.userProfile.email){
        this.verSvc.submitSection(
          this.userRegistration.docId, 
          this.userRegistration.steps[stepIndex].forms[formIndex].docId, 
          section
        ).subscribe((form: Form) => {
          this.userRegistration.steps[stepIndex].forms[formIndex] = form;
        }); 
      }
      else{
        let approverRole = this.getApproverRole(section);
        if(approverRole){

        }
      }
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
