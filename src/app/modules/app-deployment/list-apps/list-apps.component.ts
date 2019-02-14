import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {Subscription, from} from 'rxjs';
import {VendorsService} from '../../../services/vendors.service';
import {AppsService} from '../../../services/apps.service';
import {Vendor} from '../../../models/vendor.model';
import {App} from '../../../models/app.model';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {CreateAppFormComponent} from '../create-app-form/create-app-form.component';
import {Router} from '@angular/router';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';

@Component({
  selector: 'app-list-apps',
  templateUrl: './list-apps.component.html',
  styleUrls: ['./list-apps.component.scss']
})
export class ListAppsComponent implements OnInit, OnDestroy {

  activeVendorSub: Subscription;
  activeVendor: Vendor;
  showCreate: boolean;
  pendingApps: Array<App>;
  approvedApps: Array<App>;

  @ViewChild(CreateAppFormComponent) createAppForm: CreateAppFormComponent;

  constructor(
    private appsSvc: AppsService,
    private vendorsSvc: VendorsService,
    private router: Router,
    private notifySvc: NotificationService) { 
      this.showCreate = false;
      this.pendingApps = new Array<App>();
      this.approvedApps = new Array<App>();
    }

  ngOnInit() {
    this.subscribeToActiveVendor();
  }

  ngOnDestroy() {
    this.activeVendorSub.unsubscribe();
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
          this.router.navigateByUrl('/portal/app-deployment/edit/' + event.body.docId);
        }
      },
      (err: any) => {
        console.log(err);
        this.createAppForm.clear();
        this.createAppForm.errorMessage = err.error.message;
      }
    );
  }

  private subscribeToActiveVendor(): void {
    this.activeVendorSub = this.vendorsSvc.activeVendorSubject.subscribe(
      (vendor: Vendor) => {
        console.log(vendor);
        if (vendor) {
          this.activeVendor = vendor;
          this.listApps();
        }
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

}
