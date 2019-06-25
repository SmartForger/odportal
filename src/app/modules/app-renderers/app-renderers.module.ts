import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MicroAppRendererComponent } from './micro-app-renderer/micro-app-renderer.component';
import { WidgetRendererComponent } from './widget-renderer/widget-renderer.component';

import {MaterialModule} from '../../material.module';
import {FeedbackWidgetComponent} from './feedback-widget/feedback-widget.component';
import {BarRatingModule} from 'ngx-bar-rating';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    MicroAppRendererComponent,
    WidgetRendererComponent,
    FeedbackWidgetComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    BarRatingModule,
    FormsModule
  ],
  exports: [
    MicroAppRendererComponent,
    WidgetRendererComponent
  ],
  entryComponents: [FeedbackWidgetComponent]
})
export class AppRenderersModule { }
