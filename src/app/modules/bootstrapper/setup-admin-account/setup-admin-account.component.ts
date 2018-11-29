import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import {CustomForm} from '../../../base-classes/custom-form';
import {AccountRepresentation} from '../../../models/account-representation.model';

@Component({
  selector: 'app-setup-admin-account',
  templateUrl: './setup-admin-account.component.html',
  styleUrls: ['./setup-admin-account.component.scss']
})
export class SetupAdminAccountComponent extends CustomForm implements OnInit {

  constructor(private formBuilder: FormBuilder) { 
    super();
  }

  ngOnInit() {
    this.buildForm();
  }

  protected buildForm(): void {
    this.form = this.formBuilder.group({
      firstName: new FormControl ('Steven', [Validators.required, Validators.maxLength(250)]),
      lastName: new FormControl ('Redman', [Validators.required, Validators.maxLength(250)]),
      email: new FormControl ('sredman@ultimateknowledge.com', [Validators.required, Validators.maxLength(254), Validators.email]),
      username: new FormControl ('smredman', [Validators.required, Validators.maxLength(250)]),
      password: new FormControl ('password', [Validators.required ])
    });
  }

}
