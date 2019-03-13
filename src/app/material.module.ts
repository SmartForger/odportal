import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatMenuModule,
} from '@angular/material';

/** Initialize MDC Web components. */
// const buttons = document.querySelectorAll('.mdc-button');
// for (const button of buttons) {
//   mdc.ripple.MDCRipple.attachTo(button);
// }

// const textFields = document.querySelectorAll('.mdc-text-field');
// for (const textField of textFields) {
//   mdc.textField.MDCTextField.attachTo(textField);
// }

@NgModule({
  imports: [
    MatButtonModule,
    MatMenuModule
  ],
  exports: [
    MatButtonModule,
    MatMenuModule
  ]
})
export class MaterialModule {}