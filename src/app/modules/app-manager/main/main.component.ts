/**
 * @description Main entry component redirects users if they do not have the client's Read permission
 * @author Steven M. Redman
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {AppPermissionsBroker} from '../../../util/app-permissions-broker';
import {Subscription} from 'rxjs';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  private broker: AppPermissionsBroker;
  private sessionUpdateSub: Subscription;

  constructor(
    private authSvc: AuthService,
    private notifySvc: NotificationService,
    private router: Router) { 
      this.broker = new AppPermissionsBroker("micro-app-manager");
    }

  ngOnInit() {
    this.verifyAppAccess();
  }

  ngOnDestroy() {
    if (this.sessionUpdateSub) {
      this.sessionUpdateSub.unsubscribe();
    }
  }

  private verifyAppAccess(): void {
    if (!this.broker.hasPermission("Read")) {
      this.notifySvc.notify({
        type: NotificationType.Warning,
        message: "You were redirected because you do not have the 'Read' permission"
      }); 
      this.router.navigateByUrl('/portal');
    }
    else {
      this.subscribeToSessionUpdate();
    }
  }

  private subscribeToSessionUpdate(): void {
    this.sessionUpdateSub = this.authSvc.observeUserSessionUpdates().subscribe(
      (userId: string) => {
        if (userId === this.authSvc.getUserId()) {
          this.verifyAppAccess();
        }
      }
    );
  }

}
