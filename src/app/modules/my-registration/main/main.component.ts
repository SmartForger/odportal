import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserRegistration } from 'src/app/models/user-registration.model';
import { UserRegistrationService } from 'src/app/services/user-registration.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material';
import { MessageDialogComponent } from '../../display-elements/message-dialog/message-dialog.component';
import { QueryParameterCollectorService } from 'src/app/services/query-parameter-collector.service';
import { Form } from 'src/app/models/form.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {

  userRegistration: UserRegistration;

  constructor(
    private authSvc: AuthService,
    private dialog: MatDialog,
    private qpcSvc: QueryParameterCollectorService,
    private route: ActivatedRoute, 
    private router: Router,
    private userRegSvc: UserRegistrationService
  ) { }

  ngOnInit() {
    this.userRegSvc.getUserRegistration(this.authSvc.userState.userId).subscribe((ur: UserRegistration) => {
      this.userRegistration = ur;
      this.qpcSvc.output();
      const cacDN: string = this.qpcSvc.getParameter(this.authSvc.globalConfig.cacDNQueryParam);
      const cacCN: string = this.qpcSvc.getParameter(this.authSvc.globalConfig.cacCNQueryParam);
      const cacEmail: string = this.qpcSvc.getParameter(this.authSvc.globalConfig.cacEmailQueryParam);
      if (cacDN) {
      	this.userRegistration.bindingRegistry[this.authSvc.globalConfig.cacDNQueryParam] = cacDN;
      }
      if (cacCN) {
      	this.userRegistration.bindingRegistry[this.authSvc.globalConfig.cacCNQueryParam] = cacCN;
      }
      if (cacEmail) {
      	this.userRegistration.bindingRegistry[this.authSvc.globalConfig.cacEmailQueryParam] = cacEmail;
      }
      console.log(this.userRegistration.bindingRegistry);
      const step: number = parseInt(this.qpcSvc.getParameter("step"));
      const form: number = parseInt(this.qpcSvc.getParameter("form"));
      if (!isNaN(step) && !isNaN(form)) {
      	this.goToForm({step: step, form: form});
      }
      else if (!isNaN(step)) {
      	this.goToStep(step);
      }
    });
  }

  ngAfterViewInit(){
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      console.log(params);
      if(params.has('showSubmittedDialog')){
        let dialogRef = this.dialog.open(MessageDialogComponent, {
          data: {
            title: 'Request Submitted',
            message: 'Your application is complete and your request has been submitted. Approval of your request is pending verification.',
            icon: 'check_circle_outline',
            iconClass: 'color-green',
            btnText: 'Acknowledge',
            btnClass: 'color-white bg-blue'
          }
        });
      }
      if(params.has('showApprovedDialog')){
        let dialogRef = this.dialog.open(MessageDialogComponent, {
          data: {
            title: 'Request Submitted',
            message: 'Your application is complete and your request has been automatically approved. You might need to refresh your page in order to view the applications given by your updated permissions.',
            icon: 'check_circle_outline',
            iconClass: 'color-green',
            btnText: 'Acknowledge',
            btnClass: 'color-white bg-blue'
          }
        });
      }
    });
  }

  uploadPhysical(event: {form: Form, doc: File}): void{
    this.userRegSvc.uploadPhysicalReplacement(
        this.userRegistration.userProfile.id, 
        this.userRegistration.docId, 
        event.form.docId, 
        event.doc
    ).subscribe((reg: UserRegistration) => {
        this.userRegistration = reg;
    });
  }

  goToStep(stepIndex: number){
    this.router.navigate(['/portal/my-registration/steps'], {queryParams: {'step': stepIndex}});
  }

  goToForm(stepAndForm: {step: number, form: number}): void{
    this.router.navigate(['/portal/my-registration/steps'], {queryParams: {'step': stepAndForm.step, 'form': stepAndForm.form}});
  }
}
