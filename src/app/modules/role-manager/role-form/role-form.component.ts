import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import {CustomForm} from '../../../base-classes/custom-form';
import {Role} from '../../../models/role.model';
import {SettableForm} from '../../../interfaces/settable-form';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent extends CustomForm implements OnInit, SettableForm {

  constructor(private formBuilder: FormBuilder) { 
    super();
  }

  ngOnInit() {
    this.buildForm();
  }

  setForm(role: Role): void {
    this.form.setValue({
      name: role.name,
      description: role.description || ""
    });
  }

  protected buildForm(): void {
    this.form = this.formBuilder.group({
      name: new FormControl ('', [Validators.required, Validators.maxLength(250)]),
      description: new FormControl ('', [Validators.required, Validators.maxLength(1000)])
    });
  }

  submitForm(role: Role): void {
    this.formSubmitted.emit(role);
  }

}
