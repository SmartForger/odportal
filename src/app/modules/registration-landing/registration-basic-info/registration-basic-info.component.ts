import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
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

@Component({
  selector: 'app-registration-basic-info',
  templateUrl: './registration-basic-info.component.html',
  styleUrls: ['./registration-basic-info.component.scss']
})

export class RegistrationBasicInfoComponent extends CustomForm implements OnInit {

  maskPassword: boolean;
  maskPasswordConfirmation: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private dialogSvc: MatDialog,
    private regAccountSvc: RegistrationAccountService,
    private authSvc: AuthService,
    private notifySvc: NotificationService) {
    super();
    this.maskPassword = true;
    this.maskPasswordConfirmation = true;
  }

  ngOnInit() {
    this.buildForm();
  }

  protected buildForm(): void {
    this.form = this.formBuilder.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email, Validators.required]),
      username: new FormControl(''),
      password: new FormControl('', [Validators.required, Validators.maxLength(25)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.maxLength(25), this.passwordRequirementsValidator()]),
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
      enabled: true
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

  private passwordRequirementsValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      let invalid: boolean = true;
      let pass: string = control.value;
      if(pass.length >= 15){
        let char: number = 0;

        let uppers: number = 0;
        let lowers: number = 0;
        let specials: number = 0;
        let numbers: number = 0;

        while(invalid && char < pass.length){
          if(pass.charAt(char).match('[A-Z]')){
            uppers++;
          }
          else if(pass.charAt(char).match('[a-z]')){
            lowers++;
          }
          else if(pass.charAt(char).match('[0-9]')){
            numbers++;
          }
          else{
            specials++;
          }

          invalid = (uppers < 2 || lowers < 2 || numbers < 2 || specials < 2);

          char++;
        }
      }
      return invalid ? {'passwordRequirements': {value: control.value}} : null;
    };
  }

}
