import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MicroAppRendererComponent } from './micro-app-renderer/micro-app-renderer.component';
import { WidgetRendererComponent } from './widget-renderer/widget-renderer.component';
import { MaterialModule } from '../../material.module';
import { FeedbackWidgetComponent } from './feedback-widget/feedback-widget.component';
import { BarRatingModule } from 'ngx-bar-rating';
import { FormsModule } from '@angular/forms';
import { NativeComponentRendererComponent } from './native-component-renderer/native-component-renderer.component';

@NgModule({
    declarations: [
        FeedbackWidgetComponent,
        MicroAppRendererComponent,
        NativeComponentRendererComponent,
        WidgetRendererComponent
    ],
    imports: [
        BarRatingModule,
        FormsModule,
        CommonModule,
        MaterialModule
    ],
    exports: [
        MicroAppRendererComponent,
        NativeComponentRendererComponent,
        WidgetRendererComponent
    ],
    entryComponents: [
        FeedbackWidgetComponent
    ]
})
export class AppRenderersModule { }
