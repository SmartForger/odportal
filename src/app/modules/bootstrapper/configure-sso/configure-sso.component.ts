import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-configure-sso',
  templateUrl: './configure-sso.component.html',
  styleUrls: ['./configure-sso.component.scss']
})
export class ConfigureSsoComponent implements OnInit {

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): void {
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
