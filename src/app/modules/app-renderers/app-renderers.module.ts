import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MicroAppRendererComponent } from './micro-app-renderer/micro-app-renderer.component';

@NgModule({
  declarations: [
    MicroAppRendererComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MicroAppRendererComponent
  ]
})
export class AppRenderersModule { }
