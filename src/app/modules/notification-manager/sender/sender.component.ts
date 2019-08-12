import { Component, OnInit } from '@angular/core';
import {SystemNotification} from '../../../models/system-notification.model';
import {SystemNotificationsService} from '../../../services/system-notifications.service';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';

@Component({
  selector: 'app-sender',
  templateUrl: './sender.component.html',
  styleUrls: ['./sender.component.scss']
})
export class SenderComponent implements OnInit {

  constructor(
    private snSvc: SystemNotificationsService,
    private notifySvc: NotificationService) { }

  ngOnInit() {
  }

  sendNotification(notification: SystemNotification): void {
    this.snSvc.createNotification(notification).subscribe(
      (notification: SystemNotification) => {
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: "Your notification was sent successfully"
        });
      },
      (err: any) => {
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while sending the notification"
        });
      }
    );
  }

}
