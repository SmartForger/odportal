import { Component, OnInit, OnDestroy } from '@angular/core';
import {NotifierService} from 'angular-notifier';
import {Subscription} from 'rxjs';
import {NotificationService} from './notification.service';
import {Notification} from './notificiation.model';

@Component({
  selector: 'app-notifier',
  templateUrl: './notifier.component.html',
  styleUrls: ['./notifier.component.scss']
})
export class NotifierComponent implements OnInit, OnDestroy {

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

  private subscribeToNotifications(): void {
    this.notifySub = this.notificationSvc.notificationSubject.subscribe(
      (notification: Notification) => {
        this.notifierSvc.notify(notification.type, notification.message);
      }
    );
  }

}
