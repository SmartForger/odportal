import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { CustomForm } from '../../../base-classes/custom-form';
import {AccountRepresentation} from '../../../models/account-representation.model';
import {UserRepresentation} from '../../../models/user-representation.model';
import {CredentialsRepresentation} from '../../../models/credentials-representation.model';
import {UsersService} from '../../../services/users.service';

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
    private usersSvc: UsersService) {
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
      confirmPassword: new FormControl('', [Validators.required, Validators.maxLength(25)]),
      acceptedPrivacyPolicy: new FormControl(false)
    });
    this.form.controls['username'].disable();
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
    /*const userRep: UserRepresentation = {
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
    this.createAccount(userRep, credsRep);*/
  }

  private createAccount(userRep: UserRepresentation, credsRep: CredentialsRepresentation): void {
    this.usersSvc.create(userRep).subscribe(
      (response: any) => {
        this.updateCredentials(credsRep);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private updateCredentials(credsRep: CredentialsRepresentation): void {
    
  }

}
