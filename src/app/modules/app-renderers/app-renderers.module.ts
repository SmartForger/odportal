import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MicroAppRendererComponent } from './micro-app-renderer/micro-app-renderer.component';
import { WidgetRendererComponent } from './widget-renderer/widget-renderer.component';

@NgModule({
  declarations: [
    MicroAppRendererComponent,
    WidgetRendererComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MicroAppRendererComponent,
    WidgetRendererComponent
  ]
})
export class AppRenderersModule { }
