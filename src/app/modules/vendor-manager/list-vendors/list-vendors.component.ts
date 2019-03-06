import { Component, OnInit, ViewChild } from '@angular/core';
import {Vendor} from '../../../models/vendor.model';
import {VendorsService} from '../../../services/vendors.service';
import { AppPermissionsBroker } from 'src/app/util/app-permissions-broker';
import {VendorFormComponent} from '../vendor-form/vendor-form.component';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-list-vendors',
  templateUrl: './list-vendors.component.html',
  styleUrls: ['./list-vendors.component.scss']
})
export class ListVendorsComponent implements OnInit {

  vendors: Array<Vendor>;
  showCreate: boolean;
  broker: AppPermissionsBroker;
  canCreate: boolean;

  @ViewChild(VendorFormComponent) vendorForm: VendorFormComponent;

  constructor(
    private vendorsSvc: VendorsService,
    private notifySvc: NotificationService,
    private crumbsSvc: BreadcrumbsService,
    private router: Router) { 
    this.vendors = new Array<Vendor>();
    this.showCreate = false;
    this.broker = new AppPermissionsBroker("vendor-manager");
    this.canCreate = false;
  }

  ngOnInit() {
    this.listVendors();
    this.setPermissions();
  }

  showCreateModal(): void {
    this.vendorForm.clearForm();
    this.showCreate = true;
  }

  createVendor(vendor: Vendor): void {
    this.showCreate = false;
    this.vendorsSvc.createVendor(vendor).subscribe(
      (v: Vendor) => {
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: `${v.name} was created successfully`
        });
        this.router.navigateByUrl(`/portal/vendor-manager/edit/${v.docId}`);
      },
      (err: any) => {
        console.log(err);
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while creating this vendor"
        });
      }
    );
  }

  private listVendors(): void {
    this.vendorsSvc.listVendors().subscribe(
      (vendors: Array<Vendor>) => {
        this.vendors = vendors;
      },
      (err: any) =>{
        console.log(err);
      }
    );
  }

  private setPermissions(): void {
    this.canCreate = this.broker.hasPermission("Create");
  }

}
