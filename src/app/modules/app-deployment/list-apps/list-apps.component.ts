import { Component, OnInit, ViewChild } from '@angular/core';
import {Subscription} from 'rxjs';
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

@Component({
  selector: 'app-list-apps',
  templateUrl: './list-apps.component.html',
  styleUrls: ['./list-apps.component.scss']
})
export class ListAppsComponent implements OnInit {

  activeVendorSub: Subscription;
  activeVendor: Vendor;
  showCreate: boolean;
  pendingApps: Array<App>;
  approvedApps: Array<App>;
  broker: AppPermissionsBroker;
  canCreate: boolean;

  @ViewChild(CreateAppFormComponent) createAppForm: CreateAppFormComponent;

  constructor(
    private appsSvc: AppsService,
    private vendorsSvc: VendorsService,
    private router: Router,
    private route: ActivatedRoute,
    private notifySvc: NotificationService,
    private authSvc: AuthService,
    private crumbsSvc: BreadcrumbsService) { 
      this.showCreate = false;
      this.pendingApps = new Array<App>();
      this.approvedApps = new Array<App>();
      this.broker = new AppPermissionsBroker("micro-app-deployment");
      this.canCreate = false;
    }

  ngOnInit() {
    this.setPermissions();
    this.fetchVendor();
  }

  showCreateModal(): void {
    this.createAppForm.clear();
    this.showCreate = true;
  }

  uploadBundle(file: File): void {
    this.appsSvc.create(file).subscribe(
      (event: HttpEvent<App>) => {
        if (event.type === HttpEventType.UploadProgress) {
          let progress: number = Math.round(100 * (event.loaded / event.total));
          this.createAppForm.uploadProgress = progress;
        }
        else if (event.type === HttpEventType.Response) {
          this.createAppForm.uploadProgress = 100.00;
          this.showCreate = false;
          this.notifySvc.notify({
            message: "Your app was uploaded successfully",
            type: NotificationType.Success
          });
          this.router.navigateByUrl(`/portal/app-deployment/edit/${this.activeVendor.docId}/${event.body.docId}`);
        }
      },
      (err: any) => {
        console.log(err);
        this.createAppForm.clear();
        this.createAppForm.errorMessage = err.error.message;
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
        this.listApps();
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

  private listApps(): void {
    this.appsSvc.listVendorApps(this.activeVendor.docId).subscribe(
        (apps: Array<App>) => {
          this.pendingApps = apps.filter((app: App) => app.approved === false);
          this.approvedApps = apps.filter((app: App) => app.approved === true);
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
        active: true,
        link: null
      }
    );
    this.crumbsSvc.update(crumbs);
  }

}
