import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import { MaterialModule } from "../../material.module";

import { PasswordStrengthIndicatorComponent } from './password-strength-indicator/password-strength-indicator.component';

@NgModule({
  declarations: [PasswordStrengthIndicatorComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    PasswordStrengthIndicatorComponent
  ]
})
export class FormValidatorsModule { }
