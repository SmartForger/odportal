/**
 * @description Layout component with several child components. Responsible for fetching the vendor account and micro-app and passing these values in inputs to child components.
 * @author Steven M. Redman
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
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
import {AppPermissionsBroker} from '../../../util/app-permissions-broker';
import {MatDialog, MatDialogRef} from '@angular/material';
import {CreateAppFormComponent} from '../create-app-form/create-app-form.component';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit-app-main',
  templateUrl: './edit-app-main.component.html',
  styleUrls: ['./edit-app-main.component.scss']
})
export class EditAppMainComponent implements OnInit, OnDestroy {

  app: App;
  activeVendor: Vendor;
  canCreate: boolean;
  private broker: AppPermissionsBroker;
  private routeSub: Subscription;

  constructor(
    private appsSvc: AppsService,
    private vendorsSvc: VendorsService,
    private route: ActivatedRoute,
    private authSvc: AuthService,
    private notifySvc: NotificationService,
    private router: Router,
    private dialog: MatDialog,
    private crumbsSvc: BreadcrumbsService) { 
      this.canCreate = false;
      this.broker = new AppPermissionsBroker("micro-app-deployment");
    }

  ngOnInit() {
    this.subscribeToRouteChange();
    this.setPermissions();
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  showUpdateModal(): void {

    let modalRef: MatDialogRef<CreateAppFormComponent> = this.dialog.open(CreateAppFormComponent, {

    });

    modalRef.componentInstance.fileChosen.subscribe( (file) => {
      this.uploadBundle(file, modalRef);
    });
  }

  uploadBundle(file: File, modalRef: MatDialogRef<CreateAppFormComponent>): void {
    this.appsSvc.create(file, {vendorId: this.activeVendor.docId, clientId: this.app.clientId}).subscribe(
      (event: HttpEvent<App>) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress: number = Math.round(100 * (event.loaded / event.total));
          modalRef.componentInstance.uploadProgress = progress;
        }
        else if (event.type === HttpEventType.Response) {
          modalRef.componentInstance.uploadProgress = 100;
          modalRef.close();
          this.notifySvc.notify({
            message: "Your app was uploaded successfully",
            type: NotificationType.Success
          });
          this.router.navigateByUrl(`/portal/app-deployment/edit/${this.activeVendor.docId}/${event.body.docId}`);
        }
      },
      (err: any) => {
        console.log(err);
        modalRef.componentInstance.clear();
        modalRef.componentInstance.errorMessage = err.error.message;
      }
    );
  }

  private subscribeToRouteChange(): void {
    this.routeSub = this.route.params.subscribe(
      (params) => {
        if (!this.activeVendor) {
          this.fetchVendor();
        }
        else {
          this.fetchApp(this.activeVendor.docId);
        }
      }
    );
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

  private setPermissions(): void {
    this.canCreate = this.broker.hasPermission("Create");
  }

}
