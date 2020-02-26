import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { UserRegistration } from 'src/app/models/user-registration.model';
import { UserRegistrationService } from 'src/app/services/user-registration.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material';
import { MessageDialogComponent } from '../../display-elements/message-dialog/message-dialog.component';
import { QueryParameterCollectorService } from 'src/app/services/query-parameter-collector.service';
import { Form } from 'src/app/models/form.model';
import { RegistrationManagerService } from 'src/app/services/registration-manager.service';

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
    this.userRegSvc.getUserRegistration(this.authSvc.userState.userId).subscribe(async (ur: UserRegistration) => {
      this.userRegistration = ur;
      
      let anyCAC = false;
      let cacBindings = { };
      this.qpcSvc.output();
      const cacCN: string = this.qpcSvc.getParameter(this.authSvc.globalConfig.cacCNQueryParam);
      const cacDN: string = this.qpcSvc.getParameter(this.authSvc.globalConfig.cacDNQueryParam);
      const cacEmail: string = this.qpcSvc.getParameter(this.authSvc.globalConfig.cacEmailQueryParam);
      if (cacCN) {
        anyCAC = true;
        cacBindings['x509cn'] = cacCN;
        this.userRegistration.bindingRegistry[this.authSvc.globalConfig.cacCNQueryParam] = cacCN;
        this.qpcSvc.deleteParameter(this.authSvc.globalConfig.cacCNQueryParam);
      }
      if (cacDN) {
        anyCAC = true;
        cacBindings['x509dn'] = cacDN;
      	this.userRegistration.bindingRegistry[this.authSvc.globalConfig.cacDNQueryParam] = cacDN;
        this.qpcSvc.deleteParameter(this.authSvc.globalConfig.cacDNQueryParam);
      }
      if (cacEmail) {
        anyCAC = true;
        cacBindings['x509email'] = cacEmail;
      	this.userRegistration.bindingRegistry[this.authSvc.globalConfig.cacEmailQueryParam] = cacEmail;
        this.qpcSvc.deleteParameter(this.authSvc.globalConfig.cacEmailQueryParam);
      }
      if(anyCAC){
        this.userRegistration = await this.userRegSvc.updateBindings(this.userRegistration.docId, cacBindings).toPromise();
      }
      
      let step, form;
      if(this.qpcSvc.hasParameter('step')){
        step = this.qpcSvc.getParameter('step');
        this.qpcSvc.deleteParameter('step');
      }
      if(this.qpcSvc.hasParameter('form')){
        form = this.qpcSvc.getParameter('form');
        this.qpcSvc.deleteParameter('form');
      }
      
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
