import { Component, OnInit } from '@angular/core';
import {FormControl, FormBuilder, Validators} from '@angular/forms';
import {CustomForm} from '../../../base-classes/custom-form';
import {SettableForm} from '../../../interfaces/settable-form';
import {App} from '../../../models/app.model';

@Component({
  selector: 'app-native-app-info-form',
  templateUrl: './native-app-info-form.component.html',
  styleUrls: ['./native-app-info-form.component.scss']
})
export class NativeAppInfoFormComponent extends CustomForm implements OnInit, SettableForm {

  constructor(private formBuilder: FormBuilder) { 
    super();
  }

  ngOnInit() {
    this.buildForm();
  }

  setForm(app: App): void {
    this.form.setValue({
      appTitle: app.appTitle,
      appIcon: app.appIcon
    });
  }

  protected buildForm(): void {
    this.form = this.formBuilder.group({
      appTitle: new FormControl('', [Validators.required, Validators.maxLength(250)]),
      appIcon: new FormControl('', [Validators.maxLength(250)])
    });
  }

}
