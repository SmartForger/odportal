import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import {NotifierService} from 'angular-notifier';
import {Subscription} from 'rxjs';
import {NotificationService} from './notification.service';
import {Notification} from './notificiation.model';

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotifierComponent implements OnInit, OnDestroy {
  @ViewChild("appNotification") customNotificationTmpl;

  private notifySub: Subscription;

  constructor(
    private notifierSvc: NotifierService, 
    private notificationSvc: NotificationService) { }

  ngOnInit() {
    this.subscribeToNotifications();
  }

  ngOnDestroy() {
    this.notifySub.unsubscribe();
  }

  hide(notificationId) {
    this.notifierSvc.hide(notificationId);
  }

  private subscribeToNotifications(): void {
    this.notifySub = this.notificationSvc.notificationSubject.subscribe(
      (notification: Notification) => {
        this.notifierSvc.show({
          type: notification.type,
          message: JSON.stringify({
            msg: notification.message,
            icon: notification.icon,
            link: notification.link,
            linkText: notification.linkText
          }),
          template: this.customNotificationTmpl
        });
      }
    );
  }

}
