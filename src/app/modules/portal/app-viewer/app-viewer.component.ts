import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppsService } from '../../../services/apps.service';
import { ActivatedRoute, Router } from '@angular/router';
import { App } from '../../../models/app.model';
import { NotificationService } from '../../../notifier/notification.service';
import { NotificationType } from '../../../notifier/notificiation.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-app-viewer',
  templateUrl: './app-viewer.component.html',
  styleUrls: ['./app-viewer.component.scss']
})
export class AppViewerComponent implements OnInit, OnDestroy {

  app: App;
  private appStoreSub: Subscription;

  constructor(
    private appsSvc: AppsService,
    private route: ActivatedRoute,
    private router: Router,
    private notifySvc: NotificationService) { }

  ngOnInit() {
    this.subscribeToAppStore();
  }

  ngOnDestroy() {
    this.appStoreSub.unsubscribe();
  }

  private subscribeToAppStore(): void {
    this.appStoreSub = this.appsSvc.appStoreSub.subscribe(
      (apps: Array<App>) => {
        if (apps.length) {
          const app: App = this.appsSvc.appStore.find((a: App) => a.docId === this.route.snapshot.params['id']);
          if (app) {
            if (!this.app) {
              this.app = app;
            }
          }
          else {
            this.notifyAndRedirect();
          }
        }
        else if (this.app && !apps.length) {
          this.notifyAndRedirect();
        }
      }
    );
  }

  private notifyAndRedirect(): void {
    this.notifySvc.notify({
      type: NotificationType.Warning,
      message: "You were redirected because you do have access to the requested application"
    });
    this.router.navigateByUrl('/portal');
  }

}
