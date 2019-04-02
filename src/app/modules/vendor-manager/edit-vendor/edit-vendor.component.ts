import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {VendorsService} from '../../../services/vendors.service';
import {Vendor} from '../../../models/vendor.model';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {ConfirmModalComponent} from '../../display-elements/confirm-modal/confirm-modal.component';
import {AppPermissionsBroker} from '../../../util/app-permissions-broker';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../services/auth.service';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';
import {MatDialog, MatDialogRef} from '@angular/material';

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

  constructor(
    private vendorsSvc: VendorsService,
    private route: ActivatedRoute,
    private router: Router,
    private notifySvc: NotificationService,
    private authSvc: AuthService,
    private crumbsSvc: BreadcrumbsService,
    private dialog: MatDialog) { 
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

  deleteVendor(btnText: string): void {
    let modalRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent, {

    });

    modalRef.componentInstance.title = 'Delete Vendor';
    modalRef.componentInstance.message = 'Are you sure you want to delete this vendor?';
    modalRef.componentInstance.icons = [{icon: 'person_outline', classList: ''}];
    modalRef.componentInstance.buttons = [{title: 'Delete', classList: 'bg-red'}];

    modalRef.componentInstance.btnClick.subscribe(btnClick => {
      if(btnClick === 'Confirm'){
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
      modalRef.close();
    });
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
    this.sessionUpdateSub = this.authSvc.observeUserSessionUpdates().subscribe(
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
