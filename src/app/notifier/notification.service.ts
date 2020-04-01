import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {Notification} from './notificiation.model';

@Injectable()
export class NotificationService {

  notificationSubject: Subject<Notification>;
  notificationActions: Subject<string>;

  constructor() { 
    this.notificationSubject = new Subject<Notification>();
    this.notificationActions = new Subject<string>();
  }

  notify(notification: Notification): void {
    this.notificationSubject.next(notification);
  }

  triggerAction(action: string): void {
    this.notificationActions.next(action);
  }
}
