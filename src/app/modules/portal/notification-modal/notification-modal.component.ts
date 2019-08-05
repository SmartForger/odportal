import { Component, OnInit, OnDestroy } from '@angular/core';
import {SystemNotificationsService} from '../../../services/system-notifications.service';
import {Subscription} from 'rxjs';
import {SystemNotification, ReadReceipt, Priority} from '../../../models/system-notification.model';
import * as moment from 'moment';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss']
})
export class NotificationModalComponent implements OnInit, OnDestroy {

  isHidden: boolean;
  notifications: Array<SystemNotification>;
  iconPriority: number;
  selectedPriority: number;

  private authSub: Subscription;
  private listSub: Subscription;
  private notificationSub: Subscription;

  constructor(private snSvc: SystemNotificationsService) { 
    this.isHidden = true;
    this.notifications = new Array<SystemNotification>();
    this.iconPriority = 0;
    this.selectedPriority = 0;
  }

  ngOnInit() {
    this.subscribeToList();
    this.subscribeToNotification();
    this.subscribeToAuth();
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
    if (this.listSub) {
      this.listSub.unsubscribe();
    }
    if (this.notificationSub) {
      this.notificationSub.unsubscribe();
    }
  }

  hideShow() {
    this.isHidden = !this.isHidden;
    this.calculateTimeDiffs();
  }

  clear(notification: SystemNotification): void {
    const index: number = this.notifications.findIndex((n: SystemNotification) => n.docId === notification.docId);
    this.notifications.splice(index, 1);
    this.setIconPriority();
    const rr: ReadReceipt = {
      notificationId: notification.docId
    };
    this.snSvc.createReadReceipt(rr).subscribe(
      (receipt: ReadReceipt) => {},
      (err: any) => {
        console.log(err);
      }
    );
  }

  clearAll(): void {
    const rrs: Array<ReadReceipt> = this.notifications.map((notification: SystemNotification) => {
      return {
        notificationId: notification.docId
      }
    });
    this.notifications = new Array<SystemNotification>();
    this.snSvc.createReadReceiptsBulk(rrs).subscribe(
      (receipts: Array<ReadReceipt>) => {},
      (err: any) => {
        console.log(err);
      }
    );  
  }

  private subscribeToAuth(): void {
    this.authSub = this.snSvc.observeAuth().subscribe(
      (success: boolean) => {
        if (success) {
          this.snSvc.list();
        }
      }
    );
  }

  private subscribeToList(): void {
    this.listSub = this.snSvc.observeList().subscribe(
      (notifications: Array<SystemNotification>) => {
        this.notifications = notifications;
        this.calculateTimeDiffs();
        this.setIconPriority();
      }
    );
  }

  private subscribeToNotification(): void {
    this.notificationSub = this.snSvc.observeNotification().subscribe(
      (notification: SystemNotification) => {
        this.notifications.unshift(notification);
        this.calculateTimeDiffs();
        this.setIconPriority();
      }
    );
  }

  private setIconPriority(): void {
    if (this.notifications.find((n: SystemNotification) => n.priority === Priority.Critical)) {
      this.iconPriority = Priority.Critical;
    }
    else if (this.notifications.find((n: SystemNotification) => n.priority === Priority.HighPriority)) {
      this.iconPriority = Priority.HighPriority;
    }
    else if (this.notifications.find((n: SystemNotification) => n.priority === Priority.LowPriority)) {
      this.iconPriority = Priority.LowPriority;
    }
    else if (this.notifications.find((n: SystemNotification) => n.priority === Priority.Passive)) {
      this.iconPriority = Priority.Passive;
    }
  }

  private calculateTimeDiffs(): void {
    if (!this.isHidden) {
      this.notifications.forEach((notification: SystemNotification) => {
        const currentTime = moment();
        const notificationTime = moment(notification.createdAt);
        const days = currentTime.diff(notificationTime, 'days');
        const hours = currentTime.diff(notificationTime, 'hours');
        const minutes = currentTime.diff(notificationTime, 'minutes');
        const seconds = currentTime.diff(notificationTime, 'seconds');
        if (days > 0) {
          notification.timestamp = (days === 1 ? `${days} day ago` : `${days} days ago`);
        }
        else if (hours > 0) {
          notification.timestamp = (hours === 1 ? `${hours} hour ago` : `${hours} hours ago`);
        }
        else if (minutes > 0) {
          notification.timestamp = (minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`);
        }    
        else {
          if (seconds === 1) {
            notification.timestamp = `${seconds} second ago`;
          }
          else {
            notification.timestamp = `${seconds} seconds ago`;
          }
        }
      });
    }
  }

}
