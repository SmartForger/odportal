import { Component, OnInit, Input } from '@angular/core';
import {CustomForm} from '../../../base-classes/custom-form';
import {CredentialsRepresentation} from '../../../models/credentials-representation.model';
import {FormBuilder, Validators, FormControl} from '@angular/forms';
import {PasswordUpdate} from '../password-update.model';
import {UsersService} from '../../../services/users.service';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss']
})
export class EditPasswordComponent extends CustomForm implements OnInit {

  passwordsMatch: boolean;

  @Input() activeUserId: string;

  constructor(
    private formBuilder: FormBuilder, 
    private usersSvc: UsersService) { 
    super();
    this.passwordsMatch = true;
  }

  ngOnInit() {
    this.buildForm();
  }

  verifyMatch(val: string): void {
    const password: string = this.form.controls['password'].value;
    const confirmPassword: string = this.form.controls['confirmPassword'].value;
    this.passwordsMatch = (password === confirmPassword);
  }

  protected buildForm(): void {
    this.form = this.formBuilder.group({
      password: new FormControl('', [Validators.required, Validators.maxLength(250)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.maxLength(250)])
    });
  }

  submitForm(passwordUpdate: PasswordUpdate): void {
    if (this.passwordsMatch) {
      const creds: CredentialsRepresentation = {
        type: "password",
        value: passwordUpdate.password,
        temporary: true
      };
      this.usersSvc.updatePassword(this.activeUserId, creds).subscribe(
        (response: any) => {
        }, 
        (err: any) => {
          console.log(err);
        }
      );
    }
  }

}
