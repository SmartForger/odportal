import { Component, OnInit } from '@angular/core';
import {AppPermissionsBroker} from '../../../util/app-permissions-broker';
import {Router} from '@angular/router';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  private broker: AppPermissionsBroker;

  constructor(private router: Router, private notifySvc: NotificationService) { 
    this.broker = new AppPermissionsBroker("role-manager");
  }

  ngOnInit() {
    if (!this.broker.hasPermission("Read")) {
      this.notifySvc.notify({
        type: NotificationType.Warning,
        message: "You were redirected because you do have the 'Read' permission"
      }); 
      this.router.navigateByUrl('/portal');
    }
  }

}
