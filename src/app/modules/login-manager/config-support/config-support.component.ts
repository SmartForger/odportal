import { Component, OnInit } from '@angular/core';
import { BasePanelComponent } from "../base-panel.component";
import { EnvironmentsServiceService } from "src/app/services/environments-service.service";
import { NotificationService } from '../../../notifier/notification.service';
import { NotificationType } from '../../../notifier/notificiation.model';

@Component({
  selector: 'app-config-support',
  templateUrl: './config-support.component.html',
  styleUrls: ['./config-support.component.scss']
})
export class ConfigSupportComponent extends BasePanelComponent
  implements OnInit {

  constructor(
    protected envConfigSvc: EnvironmentsServiceService,
    private notificationSvc: NotificationService
  ) {
    super(envConfigSvc);
  }

  ngOnInit() {
  }

  handleUpdate() {
    super.handleUpdate();

    if (this.config.faqEnabled || this.config.videosEnabled) {
      const supportButton = this.config.landingButtons.find(
        button => button.type === 'internal' && button.link === '/support'
      );
      if (!supportButton) {
        this.notificationSvc.notify({
          type: NotificationType.Warning,
          message: "You must map a support button on landing.",
          link: "#",
          linkText: "Configure",
          action: "configure_support_button"
        });
      }
    }
  }
}
