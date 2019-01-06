import { Component, OnInit } from '@angular/core';
import {CustomForm} from '../../../base-classes/custom-form';
import {KeyValue} from '../../../models/key-value.model';
import {FormControl, FormBuilder, Validators} from '@angular/forms';
import {SettableForm} from '../../../interfaces/settable-form';

@Component({
  selector: 'app-custom-attribute-form',
  templateUrl: './custom-attribute-form.component.html',
  styleUrls: ['./custom-attribute-form.component.scss']
})
export class CustomAttributeFormComponent extends CustomForm implements OnInit, SettableForm {

  constructor(private formBuilder: FormBuilder) { 
    super();
  }

  ngOnInit() {
    this.buildForm();
  }

  setForm(kv: KeyValue): void {
    this.form.setValue({
      display: kv.display,
      value: kv.value
    });
  }

  protected buildForm(): void {
    this.form = this.formBuilder.group({
      display: new FormControl('', [Validators.required]),
      value: new FormControl('')
    });
  }

}
