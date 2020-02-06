import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { CustomForm } from '../../../base-classes/custom-form';
import { AccountRepresentation } from '../../../models/account-representation.model';
import { UserRepresentation } from '../../../models/user-representation.model';
import { CredentialsRepresentation } from '../../../models/credentials-representation.model';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MessageDialogComponent, MessageDialogParams } from "../../display-elements/message-dialog/message-dialog.component";
import { RegistrationAccountService } from '../../../services/registration-account.service';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../notifier/notification.service';
import { NotificationType } from '../../../notifier/notificiation.model';
import { passwordRequirementsValidator } from '../../form-validators/custom-validators';
import { PasswordRequirements } from '../../../models/password-requirements.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GlobalConfig } from 'src/app/models/global-config.model';
import { Subscription } from 'rxjs';
import { UserRegistrationService } from 'src/app/services/user-registration.service';

@Component({
  selector: 'app-registration-basic-info',
  templateUrl: './registration-basic-info.component.html',
  styleUrls: ['./registration-basic-info.component.scss']
})

export class RegistrationBasicInfoComponent extends CustomForm implements OnInit, OnDestroy {

  maskPassword: boolean;
  maskPasswordConfirmation: boolean;
  passwordRequirements: PasswordRequirements;
  private edipi: string;
  private gcSub: Subscription;
  private procId: string;
  private x509Email: string;
  private x509CN: string;
  private x509DN: string;

  constructor(
    private formBuilder: FormBuilder,
    private dialogSvc: MatDialog,
    private regAccountSvc: RegistrationAccountService,
    private authSvc: AuthService,
    private notifySvc: NotificationService,
    private route: ActivatedRoute,
    private userRegSvc: UserRegistrationService) {
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
    this.procId = 'pcte-verifier-registration';
  }

  ngOnInit() {
    this.gcSub = this.authSvc.observeGlobalConfigUpdates().subscribe((gc: GlobalConfig) => {
      if(gc){
        this.buildForm();

        let firstName: string;
        let lastName: string;
        this.route.queryParamMap.subscribe((queryMap: ParamMap) => {
          if(queryMap.has('procId')){
            this.procId = queryMap.get('procId');
          }

          if(queryMap.has(this.authSvc.globalConfig.cacEmailQueryParam)){
            this.x509Email = queryMap.get(this.authSvc.globalConfig.cacEmailQueryParam);
            this.form.controls['email'].setValue(this.x509Email);
            this.form.controls['email'].disable();
          }
    
          if(queryMap.has(this.authSvc.globalConfig.cacCNQueryParam)){
              console.log('has cn');
            this.x509CN = decodeURI(queryMap.get(this.authSvc.globalConfig.cacCNQueryParam));

            //ECA CN = First M Last:A01094E0000016C634582CD00009108
            if(this.x509CN.match(/[a-z A-Z]+:[a-zA-Z0-9]+/g)){
              let cacArr: Array<string> = this.x509CN.split(' ');
              firstName = cacArr[0].toLowerCase();
              cacArr = cacArr[2].split(':');
              lastName = cacArr[0].toLowerCase();
            }
            //CAC CN = LAST.FIRST.M.1109501367
            else if(this.x509CN.match('[a-zA-Z]+\\.[a-zA-Z]+\\.([a-zA-Z]\\.)?[0-9]+')){
              let cacArr: Array<string> = this.x509CN.split('.');
              lastName = cacArr[0].toLowerCase();
              firstName = cacArr[1].toLowerCase();
              this.edipi = cacArr[cacArr.length - 1];
            }

            this.form.controls['firstName'].setValue(firstName.charAt(0).toUpperCase() + firstName.substr(1));
            this.form.controls['lastName'].setValue(lastName.charAt(0).toUpperCase() + lastName.substr(1));
            
          }
    
          if(queryMap.has(this.authSvc.globalConfig.cacDNQueryParam)){
            console.log('has dn');
            this.x509DN = queryMap.get(this.authSvc.globalConfig.cacDNQueryParam);
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
      email: this.x509Email || account.email,
      enabled: true,
      attributes: {
        X509_USER_EMAIL: this.x509Email,
        X509_USER_CN: this.x509CN,
        X509_USER_DN: this.x509DN
      }
    };

    const credsRep: CredentialsRepresentation = {
      type: 'password',
      temporary: false,
      value: account.password
    };

    this.createAccount(userRep, credsRep, this.procId);
  }

//   submitAsVerifier(account: AccountRepresentation): void{

//     const userRep: UserRepresentation = {
//         username: account.username,
//         firstName: account.firstName,
//         lastName: account.lastName,
//         email: this.x509Email || account.email,
//         enabled: true,
//         attributes: {
//           X509_USER_EMAIL: this.x509Email,
//           X509_USER_CN: this.x509CN,
//           X509_USER_DN: this.x509DN
//         }
//       };
  
//       const credsRep: CredentialsRepresentation = {
//         type: 'password',
//         temporary: false,
//         value: account.password
//       };
  
//       this.createAccount(userRep, credsRep, 'pcte-verifier-registration');
//   }

  getConfig(): GlobalConfig{
    return this.authSvc.globalConfig;
  }

  getCacUrl(): string{
    return `${this.getConfig().cacAuthURL}`;
  }

  private createAccount(userRep: UserRepresentation, credsRep: CredentialsRepresentation, procId: string): void {
    let bindingInitializations = [];
    if(this.x509Email){
        bindingInitializations.push({
            binding: 'x509email',
            value: this.x509Email
        });
        bindingInitializations.push({
            binding: 'email',
            readonly: true,
            value: this.x509Email
        });
    }
    if(this.x509CN){
        bindingInitializations.push({
            binding: 'x509cn',
            value: this.x509CN
        });
    }
    if(this.x509DN){
        bindingInitializations.push({
            binding: 'x509dn',
            value: this.x509DN
        });
    }
    if(this.edipi){
        bindingInitializations.push({
            binding: 'edipi',
            value: this.edipi
        });
    }

    this.regAccountSvc.createApplicantAccount(procId, userRep, credsRep, bindingInitializations).subscribe(
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
      title: "Account Created",
      message: `Your username is: <strong>${username}</strong>`,
      btnText: "Login to Registration Portal",
      btnClass: "btn-blue"
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
