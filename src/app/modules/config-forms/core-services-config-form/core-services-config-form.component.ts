import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import {CustomForm} from '../../../base-classes/custom-form';

@Component({
  selector: 'app-core-services-config-form',
  templateUrl: './core-services-config-form.component.html',
  styleUrls: ['./core-services-config-form.component.scss']
})
export class CoreServicesConfigFormComponent extends CustomForm implements OnInit {

  constructor(private formBuilder: FormBuilder) { 
    super();
  }

  ngOnInit() {
    this.buildForm();
  }

  protected buildForm(): void {
    this.form = this.formBuilder.group({
      vendorsServiceConnection: new FormControl ('', [Validators.required, Validators.maxLength(2048)]),
      rolesServiceConnection: new FormControl('', [Validators.required, Validators.maxLength(2048)]),
      usersServiceConnection: new FormControl('', [Validators.required, Validators.maxLength(2048)]),
      appsServiceConnection: new FormControl('', [Validators.required, Validators.maxLength(2048)]),
      widgetsServiceConnection: new FormControl('', [Validators.required, Validators.maxLength(2048)]),
      servicesServiceConnection: new FormControl('', [Validators.required, Validators.maxLength(2048)])
    });
  }

}
