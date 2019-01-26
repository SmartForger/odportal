import { Component, OnInit } from '@angular/core';
import {CustomForm} from '../../../base-classes/custom-form';
import {FormControl, Validators, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-sso-admin-creds-form',
  templateUrl: './sso-admin-creds-form.component.html',
  styleUrls: ['./sso-admin-creds-form.component.scss']
})
export class SsoAdminCredsFormComponent extends CustomForm implements OnInit {

  constructor(private formBuilder: FormBuilder) { 
    super();
  }

  ngOnInit() {
    this.buildForm();
  }

  protected buildForm(): void {
    this.form = this.formBuilder.group({
      username: new FormControl('', [Validators.required, Validators.maxLength(250)]),
      password: new FormControl('', [Validators.required, Validators.maxLength(250)])
    });
  }

}
