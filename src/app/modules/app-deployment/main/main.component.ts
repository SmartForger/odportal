/**
 * @description Main component for the module. Subscribes to user session updates and verifies the user can still access the application. Redirects the user if conditions prevent access.
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

  private vendorBroker: AppPermissionsBroker;
  private appBroker: AppPermissionsBroker;
  private sessionUpdateSub: Subscription;

  constructor(
    private authSvc: AuthService,
    private notifySvc: NotificationService,
    private router: Router) { 
      this.vendorBroker = new AppPermissionsBroker('vendor-manager');
      this.appBroker = new AppPermissionsBroker('micro-app-deployment');
    }

  ngOnInit() {
    this.verifyAppAccess();
    this.subscribeToSessionUpdate();
  }

  ngOnDestroy() {
    if (this.sessionUpdateSub) {
      this.sessionUpdateSub.unsubscribe();
    }
  }

  private verifyAppAccess(): void {
    if (!this.vendorBroker.hasPermission("Read") || !this.appBroker.hasPermission("Read")) {
      this.notifyAndRedirect("You were redirected because you do not have the 'Read' permission");
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

  private notifyAndRedirect(message: string): void {
    this.notifySvc.notify({
      type: NotificationType.Warning,
      message: message
    });
    this.router.navigateByUrl('/portal');
  }

}
