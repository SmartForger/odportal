import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import {CustomForm} from '../../../base-classes/custom-form';

@Component({
  selector: 'app-sso-config-form',
  templateUrl: './sso-config-form.component.html',
  styleUrls: ['./sso-config-form.component.scss']
})
export class SsoConfigFormComponent extends CustomForm implements OnInit {

  constructor(private formBuilder: FormBuilder) { 
    super();
  }

  ngOnInit() {
    this.buildForm();
  }

  protected buildForm(): void {
    this.form = this.formBuilder.group({
      ssoConnection: new FormControl ('', [Validators.required, Validators.maxLength(2048)]),
      realmDisplayName: new FormControl ('', [Validators.required, Validators.maxLength(250)]),
      realm: new FormControl ('', [Validators.required, Validators.maxLength(250)]),
      publicClientName: new FormControl ('', [Validators.required, Validators.maxLength(250)]),
      publicClientId: new FormControl ('', [Validators.required, Validators.maxLength(250)]),
      bearerClientName: new FormControl ('', [Validators.required, Validators.maxLength(250)]),
      bearerClientId: new FormControl ('', [Validators.required, Validators.maxLength(250)])
    });
  }
}
