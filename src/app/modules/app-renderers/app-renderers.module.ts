import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MicroAppRendererComponent } from './micro-app-renderer/micro-app-renderer.component';
import { WidgetRendererComponent } from './widget-renderer/widget-renderer.component';

import {MaterialModule} from '../../material.module';

@NgModule({
  declarations: [
    MicroAppRendererComponent,
    WidgetRendererComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    MicroAppRendererComponent,
    WidgetRendererComponent
  ]
})
export class AppRenderersModule { }
