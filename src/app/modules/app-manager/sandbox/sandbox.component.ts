import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppsService} from '../../../services/apps.service';
import {App} from '../../../models/app.model';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {NotificationService} from '../../../notifier/notification.service';
import {Widget} from '../../../models/widget.model';
import {WidgetWindowsService} from '../../../services/widget-windows.service';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.scss']
})

export class SandboxComponent implements OnInit {

  app: App;
  showTools: boolean;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private appsSvc: AppsService,
    private crumbsSvc: BreadcrumbsService,
    private wwSvc: WidgetWindowsService,
    private notifySvc: NotificationService) { 
      this.showTools = true;
    }

  ngOnInit() {
    this.fetchApp();
  }

  private fetchApp(): void {
    this.appsSvc.fetch(this.route.snapshot.params['id']).subscribe(
      (app: App) => {
        if (!app.native) {
          this.app = app;
          this.generateCrumbs();
        }
        else {
          this.notifyAndRedirect(app.docId);
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private notifyAndRedirect(appId: string): void {
    this.notifySvc.notify({
      type: NotificationType.Warning,
      message: "Native apps are not testable"
    });
    this.router.navigateByUrl(`/portal/app-manager/edit/${appId}`);
  }

  private generateCrumbs(): void {
    const crumbs: Array<Breadcrumb> = new Array<Breadcrumb>(
      {
        title: "Dashboard",
        active: false,
        link: '/portal'
      },
      {
        title: "MicroApp Manager",
        active: false,
        link: '/portal/app-manager'
      },
      {
        title: this.app.appTitle + " Details",
        active: false,
        link: `/portal/app-manager/edit/${this.app.docId}`
      },
      {
        title: `${this.app.appTitle} Testing`,
        active: true,
        link: null
      }
    );
    this.crumbsSvc.update(crumbs);
  }

  widgetClicked(widget: Widget): void {
    this.wwSvc.addWindow({app: this.app, widget: widget});
  }
}

export class ExpansionStepsSidebar {
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}