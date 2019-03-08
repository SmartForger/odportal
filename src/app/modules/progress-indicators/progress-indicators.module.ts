import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StandardFileProgressBarComponent } from './standard-file-progress-bar/standard-file-progress-bar.component';

@NgModule({
  declarations: [StandardFileProgressBarComponent],
  imports: [
    CommonModule
  ],
  exports: [
    StandardFileProgressBarComponent
  ]
})
export class ProgressIndicatorsModule { }
