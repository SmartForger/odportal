import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserRegistration, StepStatus, UserRegistrationStep } from 'src/app/models/user-registration.model';
import { RegistrationSection } from 'src/app/models/form.model';
import { MatTabGroup, MatDialog, MatDialogRef } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { RegistrationManagerService } from 'src/app/services/registration-manager.service';
import { UsersService } from 'src/app/services/users.service';
import { Role } from 'src/app/models/role.model';
import { RolesService } from 'src/app/services/roles.service';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import * as moment from 'moment';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  get userRegistration(): UserRegistration{
    return this._userRegistration;
  }
  set userRegistration(ur: UserRegistration){
    this._userRegistration = ur;
    if(this._userRegistration){
      this.setAllStepsComplete();
      this.setIsApprovedUser();
    }
    else{
      this.allStepsComplete = false;
      this.isApprovedUser = false;
    }
  }
  private _userRegistration: UserRegistration;
  formIndex: number;
  allStepsComplete: boolean;
  isApprovedUser: boolean;
  private goingToStep: boolean;

  @ViewChild(MatTabGroup) tabs: MatTabGroup;

  constructor(
    private route: ActivatedRoute, 
    private regManagerSvc: RegistrationManagerService,
    private authSvc: AuthService,
    private userSvc: UsersService,
    private roleSvc: RolesService,
    private dialog: MatDialog
  ){
    this.userRegistration = null;
    this.formIndex = 0;
    this.goingToStep = false;
    this.allStepsComplete = false;
    this.isApprovedUser = false;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.regManagerSvc.getUserRegistration(id).subscribe((ur: UserRegistration) => {
      this.userRegistration = ur;
      this.tabs.selectedIndex = 0;
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

  approveUser(): void{
    this.regManagerSvc.approveUser(this.userRegistration.docId).subscribe((ur: UserRegistration) => {
      this.userRegistration = ur;
    });
  }

  unapproveUser(): void{
    this.regManagerSvc.unapproveUser(this.userRegistration.docId).subscribe((ur: UserRegistration) => {
      this.userRegistration = ur;
    });
  }

  restartRegistration(): void{
    let mdr: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        title: "Restart User Registration",
        subtitle: "Are you sure you want to force this user to restart their registration? All data entered by the applicant and administrators will be lost permenantly. If the registration process has been updated since the applicant started, they will receive any changes to the registration process when they restart.",
        type: PlatformModalType.SECONDARY,
        submitButtonClass: "bg-yellow",
        submitButtonIcon: "error",
        submitButtonTitle: "Force Restart",
        formFields: [
          {
            type: "static",
            label: "Applicant Name",
            defaultValue: `${this.userRegistration.userProfile.firstName} ${this.userRegistration.userProfile.lastName}`
          },
          {
            type: "static",
            label: "Applicant Username",
            defaultValue: this.userRegistration.userProfile.username
          },
          {
            type: "static",
            label: "Applicant Email",
            defaultValue: this.userRegistration.userProfile.email
          },
          {
            type: "static",
            label: "Registration Start Date",
            defaultValue: moment(this.userRegistration.createdAt).format('YYYY/MM/DD')
          }
        ]
      }
    });

    mdr.afterClosed().subscribe(data => {
      if (data) {
        console.log(this.userRegistration);
        this.regManagerSvc.restartRegistration(this.userRegistration.docId).subscribe((newReg: UserRegistration) => {
          this.userRegistration = newReg;
          this.goToStep(-1);
        });
      }
    });
  }

  deleteAccount(): void{
    let mdr: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        title: "Delete Applicant Account",
        subtitle: "WARNING: are you sure you wish to delete this applicant's account? This will remove them from the entire system in addition to the registration process. This action might have unintended consequences and cannot be undone. If you are unsure, do not continue.",
        type: PlatformModalType.SECONDARY,
        submitButtonClass: "bg-red",
        submitButtonIcon: "warning",
        submitButtonTitle: "Delete Applicant Account",
        formFields: [
          {
            type: "static",
            label: "Applicant Name",
            defaultValue: `${this.userRegistration.userProfile.firstName} ${this.userRegistration.userProfile.lastName}`
          },
          {
            type: "static",
            label: "Applicant Username",
            defaultValue: this.userRegistration.userProfile.username
          },
          {
            type: "static",
            label: "Applicant Email",
            defaultValue: this.userRegistration.userProfile.email
          },
          {
            type: "static",
            label: "Registration Start Date",
            defaultValue: moment(this.userRegistration.createdAt).format('YYYY/MM/DD')
          }
        ]
      }
    });


    mdr.afterClosed().subscribe(data => {
      if (data) {
        this.regManagerSvc.deleteAccount(this.userRegistration.userProfile.id).subscribe();
      }
    });
      
  }

  private setAllStepsComplete(): void{
    let allStepsComplete = true;
    let stepIndex = 0;
    while(allStepsComplete && stepIndex < this.userRegistration.steps.length){
      if(this.userRegistration.steps[stepIndex].status !== 'complete'){
        allStepsComplete = false;
      }
      stepIndex++;
    }
    this.allStepsComplete = allStepsComplete;
  }

  private setIsApprovedUser(): void{
    let approved = false;
    this.userSvc.listAssignedRoles(this.userRegistration.userProfile.id).subscribe((roles: Array<Role>) => {
      let roleIndex = 0;
      while(!approved && roleIndex < roles.length){
        approved = roles[roleIndex].name === this.authSvc.globalConfig.approvedRoleName;
        roleIndex++;
      }
      this.isApprovedUser = approved;
    });
  }
}
