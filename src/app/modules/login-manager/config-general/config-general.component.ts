import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { BasePanelComponent } from '../base-panel.component';
import { EnvironmentsServiceService } from 'src/app/services/environments-service.service';
import { NotificationService } from '../../../notifier/notification.service';
import { NotificationType } from '../../../notifier/notificiation.model';

@Component({
  selector: 'app-config-general',
  templateUrl: './config-general.component.html',
  styleUrls: ['./config-general.component.scss']
})
export class ConfigGeneralComponent extends BasePanelComponent implements OnInit {
  readonly classifications = {
    "none": {
      label: "NONE",
      color: "#B5B5B5"
    },
    "unclassified": {
      label: "UNCLASSIFIED",
      color: "#3B8553"
    },
    "secret": {
      label: "SECRET",
      color: "#A52115"
    },
    "topsecret": {
      label: "TOP SECRET",
      color: "#C37429"
    }
  }

  constructor(
    protected envConfigSvc: EnvironmentsServiceService,
    private notificationSvc: NotificationService
  ) {
    super(envConfigSvc);
  }

  ngOnInit() {
  }

  get classificationsArray() {
    return Object.keys(this.classifications);
  }

  handleUpdate() {
    super.handleUpdate();

    if (this.config.allowPasswordReset && !this.config.smtpNativeRelay) {
      this.notificationSvc.notify({
        type: NotificationType.Warning,
        message: "You must map SMTP for forgot password.",
        link: "#",
        linkText: "Configure",
        action: "configure_smtp"
      });
    }
  }
}
