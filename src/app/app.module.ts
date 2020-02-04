import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injector } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DeviceDetectorModule } from 'ngx-device-detector';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoadingComponent } from './loading/loading.component';
import { AjaxProgressComponent } from './ajax-progress/ajax-progress.component';

import { AjaxInterceptor } from './interceptors/ajax-interceptor';

import { ServiceLocator } from './service-locator';

import { MaterialModule } from './material.module';

import { FeedbackService } from './services/feedback.service';

import { AppNotifierModule } from './notifier/notifier.module';

@NgModule({
  declarations: [AppComponent, LoadingComponent, AjaxProgressComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    AppNotifierModule,
    DeviceDetectorModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AjaxInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  //We inject the feedback service here to guarantee its instantiation so the route params collected by the service
  //are immediately available to the feedback component
  constructor(private injector: Injector, private fbSvc: FeedbackService) {
    ServiceLocator.injector = this.injector;
  }
}
