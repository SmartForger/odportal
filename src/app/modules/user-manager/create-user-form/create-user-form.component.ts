import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {CustomForm} from '../../../base-classes/custom-form';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {UserRepresentation} from '../../../models/user-representation.model';
import { AccountRepresentation } from 'src/app/models/account-representation.model';
import {CredentialsRepresentation} from '../../../models/credentials-representation.model';

@Component({
  selector: 'app-create-user-form',
  templateUrl: './create-user-form.component.html',
  styleUrls: ['./create-user-form.component.scss']
})
export class CreateUserFormComponent extends CustomForm implements OnInit {

  @Output() close: EventEmitter<void>;

  constructor(private formBuilder: FormBuilder) { 
    super();

    this.close = new EventEmitter<void>();
  }

  ngOnInit() {
    this.buildForm();
  }

  protected buildForm(): void {
    this.form = this.formBuilder.group({
      username: new FormControl('', [Validators.required, Validators.maxLength(250)]),
      firstName: new FormControl('', [Validators.required, Validators.maxLength(250)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(250)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(254)]),
      password: new FormControl('', [Validators.required, Validators.maxLength(250)])
    });
  }

  submitForm(account: AccountRepresentation): void {
    const userRep: UserRepresentation = {
      username: account.username,
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      enabled: true
    };
    const creds: CredentialsRepresentation = {
      type: "password",
      value: account.password,
      temporary: true
    }
    this.formSubmitted.emit({user: userRep, creds: creds});
  }

}
