import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {Notification} from './notificiation.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notificationSubject: Subject<Notification>;

  constructor() { 
    this.notificationSubject = new Subject<Notification>();
  }

  notify(notification: Notification): void {
    this.notificationSubject.next(notification);
  }
}
