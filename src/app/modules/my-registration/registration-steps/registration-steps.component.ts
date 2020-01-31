import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { UserRegistrationService } from 'src/app/services/user-registration.service';
import { UserRegistration, RegistrationStatus } from 'src/app/models/user-registration.model';
import { AuthService } from 'src/app/services/auth.service';
import { StepStatus } from '../../../models/user-registration.model';
import { FormStatus, RegistrationSection } from '../../../models/form.model';
import { MatStepper, MatDialog, MatDialogRef } from '@angular/material';
import { ApproverContactsComponent } from '../approver-contacts/approver-contacts.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { PlatformFormField } from 'src/app/models/platform-form-field.model';

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
    private authSvc: AuthService, 
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,  
    private userRegSvc: UserRegistrationService
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
      ).subscribe(
        (ur: UserRegistration) => {
          this.userRegistration = ur;
          if(this.userRegistration.status === RegistrationStatus.Submitted || this.userRegistration.status === RegistrationStatus.Complete){
              if(this.userRegistration.approvalStatus){
                  this.router.navigateByUrl('/portal/my-registration?showApprovedDialog=1');
              }
              else{
                  this.router.navigateByUrl('/portal/my-registration?showSubmittedDialog=1');
              }
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
        },
        (err: any) => {
          let triggerResult = err.error;
          if(typeof triggerResult === 'object' && Object.prototype.hasOwnProperty.call(triggerResult, 'type') && triggerResult.type === 'trigger-result'){
            let fields: Array<PlatformFormField> = [ ];
            if(Object.prototype.hasOwnProperty.call(triggerResult, 'data') && typeof triggerResult.data === 'object'){
              Object.keys(triggerResult.data).forEach((prop: string) => {
                fields.push({
                  type: 'static',
                  label: prop,
                  defaultValue: triggerResult.data[prop]
                });
              });
            }

            let modalRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
              data: {
                type: PlatformModalType.PRIMARY,
                title: "Form Submission Error",
                subtitle: triggerResult.message,
                submitButtonTitle: "Confirm",
                submitButtonClass: "",
                formFields: fields
              }
            });
          }
        }
      );
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
