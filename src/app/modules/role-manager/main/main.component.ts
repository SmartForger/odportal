import { Component, OnInit, OnDestroy } from '@angular/core';
import {AppPermissionsBroker} from '../../../util/app-permissions-broker';
import {Router} from '@angular/router';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {AuthService} from '../../../services/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  private broker: AppPermissionsBroker;
  private sessionUpdatedSub: Subscription;

  constructor(
    private router: Router, 
    private notifySvc: NotificationService,
    private authSvc: AuthService) { 
    this.broker = new AppPermissionsBroker("role-manager");
  }

  ngOnInit() {
    this.verifyAppAccess();
    this.subscribeToSessionUpdate();
  }

  ngOnDestroy() {
    this.sessionUpdatedSub.unsubscribe();
  }

  private verifyAppAccess(): void {
    if (!this.broker.hasPermission("Read")) {
      this.notifySvc.notify({
        type: NotificationType.Warning,
        message: "You were redirected because you do have the 'Read' permission"
      }); 
      this.router.navigateByUrl('/portal');
    }
  }

  private subscribeToSessionUpdate(): void {
    this.sessionUpdatedSub = this.authSvc.sessionUpdatedSubject.subscribe(
      (userId: string) => {
        if (userId === this.authSvc.getUserId()) {
          this.verifyAppAccess();
        }
      }
    );
  }

}
