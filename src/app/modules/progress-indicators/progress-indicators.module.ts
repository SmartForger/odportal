import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StandardFileProgressBarComponent } from './standard-file-progress-bar/standard-file-progress-bar.component';

import {MaterialModule} from '../../material.module';

@NgModule({
  declarations: [StandardFileProgressBarComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    StandardFileProgressBarComponent
  ]
})
export class ProgressIndicatorsModule { }
