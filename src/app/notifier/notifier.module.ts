import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatButtonModule } from '@angular/material';

import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { NotifierComponent } from './notifier.component';
import { ObjectPropPipe } from './object-prop.pipe';
import { NotificationService } from './notification.service';

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
      NotifierComponent,
      ObjectPropPipe
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    NotifierModule.withConfig(notifierDefaultOptions),
  ],
  exports: [
      NotifierComponent
  ],
  providers: [
      NotificationService
  ]
})
export class AppNotifierModule { }
