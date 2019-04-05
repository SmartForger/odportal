/**
 * @description Layout component with several child components. Responsible for fetching the vendor account and micro-app and passing these values in inputs to child components.
 * @author Steven M. Redman
 */

import { Component, OnInit } from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {VendorsService} from '../../../services/vendors.service';
import {App} from '../../../models/app.model';
import {Vendor} from '../../../models/vendor.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';
import {AuthService} from '../../../services/auth.service';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';

@Component({
  selector: 'app-edit-app-main',
  templateUrl: './edit-app-main.component.html',
  styleUrls: ['./edit-app-main.component.scss']
})
export class EditAppMainComponent implements OnInit {

  app: App;
  activeVendor: Vendor;

  constructor(
    private appsSvc: AppsService,
    private vendorsSvc: VendorsService,
    private route: ActivatedRoute,
    private authSvc: AuthService,
    private notifySvc: NotificationService,
    private router: Router,
    private crumbsSvc: BreadcrumbsService) { }

  ngOnInit() {
    this.fetchVendor();
  }

  private fetchVendor(): void {
    this.vendorsSvc.fetchByUserAndVendorId(this.authSvc.getUserId(), this.route.snapshot.params['vendorId']).subscribe(
      (vendor: Vendor) => {
        this.activeVendor = vendor;
        this.fetchApp(this.activeVendor.docId);
      },
      (err: any) => {
        console.log(err);
        this.notifySvc.notify({
          type: NotificationType.Warning,
          message: "You are not a member of the requested vendor account"
        });
        this.router.navigateByUrl('/portal/app-deployment');
      }
    );
  }

  private fetchApp(vendorId: string): void {
    this.appsSvc.fetchVendorApp(vendorId, this.route.snapshot.params['appId']).subscribe(
      (app: App) => {
        this.app = app;
        this.generateCrumbs();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private generateCrumbs(): void {
    const crumbs: Array<Breadcrumb> = new Array<Breadcrumb>(
      {
        title: "Dashboard",
        active: false,
        link: '/portal'
      },
      {
        title: "MicroApp Deployment",
        active: false,
        link: '/portal/app-deployment'
      },
      {
        title: `${this.activeVendor.name} Apps`,
        active: false,
        link: `/portal/app-deployment/apps/${this.activeVendor.docId}`
      },
      {
        title: `${this.app.appTitle} Details`,
        active: true,
        link: null
      }
    );
    this.crumbsSvc.update(crumbs);
  }

}
