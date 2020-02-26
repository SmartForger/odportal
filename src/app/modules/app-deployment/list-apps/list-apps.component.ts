/**
 * @description Fetches and sets the active vendor and passes the vendor id to child components
 * @author Steven M. Redman
 */

import { Component, OnInit } from '@angular/core';
import {VendorsService} from '../../../services/vendors.service';
import {AppsService} from '../../../services/apps.service';
import {Vendor} from '../../../models/vendor.model';
import {App} from '../../../models/app.model';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {CreateAppFormComponent} from '../create-app-form/create-app-form.component';
import {Router, ActivatedRoute} from '@angular/router';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';
import {AppPermissionsBroker} from '../../../util/app-permissions-broker';
import {AuthService} from '../../../services/auth.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {environment as env} from '../../../../environments/environment';

@Component({
  selector: 'app-list-apps',
  templateUrl: './list-apps.component.html',
  styleUrls: ['./list-apps.component.scss']
})
export class ListAppsComponent implements OnInit {

  activeVendor: Vendor;
  broker: AppPermissionsBroker;
  canCreate: boolean;

  constructor(
    private appsSvc: AppsService,
    private vendorsSvc: VendorsService,
    private router: Router,
    private route: ActivatedRoute,
    private notifySvc: NotificationService,
    private authSvc: AuthService,
    private crumbsSvc: BreadcrumbsService,
    private dialog: MatDialog) { 
      this.broker = new AppPermissionsBroker("micro-app-deployment");
      this.canCreate = false;
    }

  ngOnInit() {
    //We skip setPermissions() for testing because there is no Keycloak instance
    if (!env.testing) {
      this.setPermissions();
    }
    this.fetchVendor();
  }

  get pageTitle() {
    return this.activeVendor ? `${this.activeVendor.name} Apps` : '';
  }

  showCreateModal(): void {

    let modalRef: MatDialogRef<CreateAppFormComponent> = this.dialog.open(CreateAppFormComponent, {

    });

    modalRef.componentInstance.fileChosen.subscribe( (file) => {
      this.uploadBundle(file, modalRef);
    });
  }

  uploadBundle(file: File, modalRef: MatDialogRef<CreateAppFormComponent>): void {
    this.appsSvc.create(file, {vendorId: this.activeVendor.docId, clientId: null}).subscribe(
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

  private setPermissions(): void {
    this.canCreate = this.broker.hasPermission("Create");
  }

  private fetchVendor(): void {
    this.vendorsSvc.fetchByUserAndVendorId(this.authSvc.getUserId(), this.route.snapshot.params['vendorId']).subscribe(
      (vendor: Vendor) => {
        this.activeVendor = vendor;
        this.generateCrumbs();
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
        active: true,
        link: null
      }
    );
    this.crumbsSvc.update(crumbs);
  }

}
