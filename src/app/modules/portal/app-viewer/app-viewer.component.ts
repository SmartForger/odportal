import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppsService } from '../../../services/apps.service';
import { ActivatedRoute, Router } from '@angular/router';
import { App } from '../../../models/app.model';
import { NotificationService } from '../../../notifier/notification.service';
import { NotificationType } from '../../../notifier/notificiation.model';
import { Subscription } from 'rxjs';
import { Breadcrumb } from '../../display-elements/breadcrumb.model';
import { BreadcrumbsService } from '../../display-elements/breadcrumbs.service';

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
    private notifySvc: NotificationService,
    private crumbsSvc: BreadcrumbsService) { }

  ngOnInit() {
    //this.subscribeToAppStore();
    this.route.params.subscribe(params => {
      if (this.appStoreSub) {
        this.appStoreSub.unsubscribe();
      }
      this.app = null;
      this.subscribeToAppStore();
    });
  }

  ngOnDestroy() {
    this.appStoreSub.unsubscribe();
  }

  private subscribeToAppStore(): void {
    this.appStoreSub = this.appsSvc.observeLocalAppCache().subscribe(
      (apps: Array<App>) => {
        const app: App = apps.find((a: App) => a.docId === this.route.snapshot.params['id']);
        if (app) {
          if (!this.app) {
            this.app = app;
            this.generateCrumbs();
          }
        }
        else {
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

  private generateCrumbs(): void {
    const crumbs: Array<Breadcrumb> = new Array<Breadcrumb>(
      {
        title: "Dashboard",
        active: false,
        link: '/portal'
      },
      {
        title: this.app.appTitle,
        active: true,
        link: null
      }
    );
    this.crumbsSvc.update(crumbs);
  }

}
