import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {VendorsService} from '../../../services/vendors.service';
import {Vendor} from '../../../models/vendor.model';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {ModalComponent} from '../../display-elements/modal/modal.component';
import {AppPermissionsBroker} from '../../../util/app-permissions-broker';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../services/auth.service';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';

@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.scss']
})
export class EditVendorComponent implements OnInit, OnDestroy {

  vendor: Vendor;
  canDelete: boolean;
  canUpdate: boolean;
  private sessionUpdateSub: Subscription;
  private broker: AppPermissionsBroker;

  @ViewChild(ModalComponent) deleteModal: ModalComponent;

  constructor(
    private vendorsSvc: VendorsService,
    private route: ActivatedRoute,
    private router: Router,
    private notifySvc: NotificationService,
    private authSvc: AuthService,
    private crumbsSvc: BreadcrumbsService) { 
      this.broker = new AppPermissionsBroker("vendor-manager");
      this.canDelete = false;
      this.canUpdate = false;
    }

  ngOnInit() {
    this.setPermissions();
    this.subscribeToSessionUpdate();
    this.fetchVendor();
  }

  ngOnDestroy() {
    this.sessionUpdateSub.unsubscribe();
  }

  updateVendor(vendor: Vendor): void {
    this.vendorsSvc.updateVendor(vendor).subscribe(
      (v: Vendor) => {
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: "The vendor was updated successfully"
        });
      },
      (err: any) => {
        console.log(err);
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: "There was problem while updating the vendor"
        });
      }
    );
  }

  removeButtonClicked(): void {
    this.deleteModal.show = true;
  }

  deleteConfirmed(btnText: string): void {
    this.deleteModal.show = false;
    this.vendorsSvc.deleteVendor(this.vendor.docId).subscribe(
      (vendor: Vendor) => {
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: "The vendor was deleted successfully"
        });
        this.router.navigateByUrl('/portal/vendor-manager');
      },
      (err: any) => {
        console.log(err);
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while deleting this vendor"
        });
      }
    );
  }

  private fetchVendor(): void {
    this.vendorsSvc.fetchById(this.route.snapshot.params['vendorId']).subscribe(
      (vendor: Vendor) => {
        this.vendor = vendor;
        this.generateCrumbs();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private subscribeToSessionUpdate(): void {
    this.sessionUpdateSub = this.authSvc.sessionUpdatedSubject.subscribe(
      (userId: string) => {
        if (userId === this.authSvc.getUserId()) {
          this.setPermissions();
        }
      }
    );
  }

  private setPermissions(): void {
    this.canDelete = this.broker.hasPermission("Delete");
    this.canUpdate = this.broker.hasPermission("Update");
  }

  private generateCrumbs(): void {
    const crumbs: Array<Breadcrumb> = new Array<Breadcrumb>(
      {
        title: "Dashboard",
        active: false,
        link: '/portal'
      },
      {
        title: "Vendor Manager",
        active: false,
        link: '/portal/vendor-manager'
      },
      {
        title: this.vendor.name + " Details",
        active: true,
        link: null
      }
    );
    this.crumbsSvc.update(crumbs);
  }

}
