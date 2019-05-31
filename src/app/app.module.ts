import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injector } from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {NotifierModule, NotifierOptions} from 'angular-notifier';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoadingComponent } from './loading/loading.component';
import { AjaxProgressComponent } from './ajax-progress/ajax-progress.component';

import {AjaxInterceptor} from './interceptors/ajax-interceptor';
import { NotifierComponent } from './notifier/notifier.component';

import {ServiceLocator} from './service-locator';

import {MaterialModule} from './material.module';

import {FeedbackService} from './services/feedback.service';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';

const notifierDefaultOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12
    },
    vertical: {
      position: 'bottom',
      distance: 12,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: false,
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,
    AjaxProgressComponent,
    NotifierComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    NotifierModule.withConfig(notifierDefaultOptions),
    BrowserAnimationsModule,
    MatPasswordStrengthModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AjaxInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { 

  //We inject the feedback service here to guarantee its instantiation so the route params collected by the service
  //are immediately available to the feedback component
  constructor(private injector: Injector, private fbSvc: FeedbackService) {
    ServiceLocator.injector = this.injector;
  }
}