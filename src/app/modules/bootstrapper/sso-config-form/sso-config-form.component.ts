import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import {CustomForm} from '../../../base-classes/custom-form';
import {Formatters} from '../../../util/formatters';
import {SettableForm} from '../../../interfaces/settable-form';
import {GlobalConfig} from '../../../models/global-config.model';

@Component({
  selector: 'app-sso-config-form',
  templateUrl: './sso-config-form.component.html',
  styleUrls: ['./sso-config-form.component.scss']
})
export class SsoConfigFormComponent extends CustomForm implements OnInit, SettableForm {

  constructor(private formBuilder: FormBuilder) { 
    super();
  }

  ngOnInit() {
    this.buildForm();
  }

  setForm(config: GlobalConfig): void {
    this.form.setValue({
      ssoConnection: config.ssoConnection,
      realmDisplayName: config.realmDisplayName,
      realm: config.realm,
      publicClientName: config.publicClientName,
      publicClientId: config.publicClientId,
      bearerClientName: config.bearerClientName,
      bearerClientId: config.bearerClientId
    });
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
    this.formCreated.emit();
  }

  valueChanged(val: string, controlName: string): void {
    this.form.get(controlName).setValue(Formatters.formatStringToId(val));
  }
}
