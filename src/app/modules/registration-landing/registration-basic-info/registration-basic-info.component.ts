import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { CustomForm } from '../../../base-classes/custom-form';
import {AccountRepresentation} from '../../../models/account-representation.model';
import {UserRepresentation} from '../../../models/user-representation.model';
import {CredentialsRepresentation} from '../../../models/credentials-representation.model';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MessageDialogComponent, MessageDialogParams } from "../../display-elements/message-dialog/message-dialog.component";
import {RegistrationAccountService} from '../../../services/registration-account.service';
import {AuthService} from '../../../services/auth.service';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {passwordRequirementsValidator} from '../../form-validators/custom-validators';
import {PasswordRequirements} from '../../../models/password-requirements.model';
import { Router, Route, ActivatedRoute, ParamMap } from '@angular/router';
import { GlobalConfig } from 'src/app/models/global-config.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-registration-basic-info',
  templateUrl: './registration-basic-info.component.html',
  styleUrls: ['./registration-basic-info.component.scss']
})

export class RegistrationBasicInfoComponent extends CustomForm implements OnInit, OnDestroy {

  maskPassword: boolean;
  maskPasswordConfirmation: boolean;
  passwordRequirements: PasswordRequirements;
  private cacEmail: string;
  private cacCn: string;
  private cacDn: string;
  private gcSub: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private dialogSvc: MatDialog,
    private regAccountSvc: RegistrationAccountService,
    private authSvc: AuthService,
    private notifySvc: NotificationService,
    private route: ActivatedRoute) {
    super();
    this.maskPassword = true;
    this.maskPasswordConfirmation = true;
    this.passwordRequirements = {
      minLength: 15,
      uppers: 2,
      lowers: 2,
      numbers: 2,
      specials: 2
    };
  }

  ngOnInit() {
    this.gcSub = this.authSvc.observeGlobalConfigUpdates().subscribe((gc: GlobalConfig) => {
      if(gc){
        this.buildForm();

        let firstName: string;
        let lastName: string;
        this.route.queryParamMap.subscribe((queryMap: ParamMap) => {
          if(queryMap.has(this.authSvc.globalConfig.cacEmailQueryParam)){
            this.cacEmail = queryMap.get(this.authSvc.globalConfig.cacEmailQueryParam);
            this.form.controls['email'].setValue(this.cacEmail);
          }
    
          if(queryMap.has(this.authSvc.globalConfig.cacCNQueryParam)){
            this.cacCn = queryMap.get(this.authSvc.globalConfig.cacCNQueryParam);
            let cacArr: Array<string> = this.cacCn.split('.');
            lastName = cacArr[0].toLowerCase();
            firstName = cacArr[1].toLowerCase();
            this.form.controls['firstName'].setValue(firstName.charAt(0).toUpperCase() + firstName.substr(1));
            this.form.controls['lastName'].setValue(lastName.charAt(0).toUpperCase() + lastName.substr(1));
          }
    
          if(queryMap.has(this.authSvc.globalConfig.cacDNQueryParam)){
            this.cacDn = queryMap.get(this.authSvc.globalConfig.cacDNQueryParam);
          }

          this.generateUserName();
        });
      }
    });
  }

  ngOnDestroy(){
    if(this.gcSub){this.gcSub.unsubscribe()}
  }

  protected buildForm(): void {
    this.form = this.formBuilder.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email, Validators.required]),
      username: new FormControl(''),
      password: new FormControl('', [Validators.required, Validators.maxLength(25), passwordRequirementsValidator(this.passwordRequirements)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.maxLength(25)]),
    });
  }

  generateUserName(): void {
    const fname: string = this.form.controls['firstName'].value;
    const lname: string = this.form.controls['lastName'].value;
    let username: string = "";
    if (fname) {
      username = fname + ".";
    }
    if (lname) {
      username += lname;
    }
    this.form.controls['username'].setValue(username.toLowerCase());
  }

  submitForm(account: AccountRepresentation): void {
    const userRep: UserRepresentation = {
      username: account.username,
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      enabled: true,
      attributes: {
        CAC_USER_EMAIL: this.cacEmail,
        CAC_USER_CN: this.cacCn,
        CAC_USER_DN: this.cacDn
      }
    };

    const credsRep: CredentialsRepresentation = {
      type: 'password',
      temporary: false,
      value: account.password
    };

    this.createAccount(userRep, credsRep);
  }

  private createAccount(userRep: UserRepresentation, credsRep: CredentialsRepresentation): void {
    this.regAccountSvc.createApplicantAccount(userRep, credsRep).subscribe(
      (user: UserRepresentation) => {
        this.showSuccessDialog(user.username);
      },
      (err: any) => {
        console.log(err);
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: "This email address is already registered"
        });
      }
    );
  }

  private showSuccessDialog(username: string): void {
    const dialogData: MessageDialogParams = {
      title: "Account Created Successfully",
      message: `Your username is: <strong>${username}</strong>`,
      btnText: "Login to Registration Portal",
      btnClass: "btn-registration"
    };
    const dialogRef: MatDialogRef<MessageDialogComponent> = this.dialogSvc.open(MessageDialogComponent, {
      data: dialogData,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      () => {
        this.authSvc.login();
      }
    );
  }


}
