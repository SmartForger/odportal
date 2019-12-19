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
import { MatDialog, MatDialogRef } from '@angular/material';
import {ApiSearchCriteria} from '../../../models/api-search-criteria.model';
import {SSPList} from '../../../base-classes/ssp-list';
import { ApiSearchResult } from 'src/app/models/api-search-result.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-list-vendors',
  templateUrl: './list-vendors.component.html',
  styleUrls: ['./list-vendors.component.scss']
})
export class ListVendorsComponent extends SSPList<Vendor> implements OnInit {

  broker: AppPermissionsBroker;
  canCreate: boolean;
  fileBasePath: string;

  @ViewChild(VendorFormComponent) vendorForm: VendorFormComponent;

  constructor(
    private vendorsSvc: VendorsService,
    private notifySvc: NotificationService,
    private crumbsSvc: BreadcrumbsService,
    private router: Router,
    private dialog: MatDialog,
    private authSvc: AuthService) { 
    super(
      new Array<string>(
        "name", "phone", "email", "users", "actions"
      ),
      new ApiSearchCriteria(
        {name: ""}, 0, "name", "asc"
      )
    );
    this.broker = new AppPermissionsBroker("vendor-manager");
    this.canCreate = false;
    this.fileBasePath = this.authSvc.globalConfig.vendorsServiceConnection + 'logos/';
  }

  ngOnInit() {
    this.listItems();
    this.setPermissions();
    this.generateCrumbs();
  }

  showCreateModal(): void {
    let modalRef: MatDialogRef<VendorFormComponent> = this.dialog.open(VendorFormComponent, {

    });

    modalRef.afterOpened().subscribe(open => {
      modalRef.componentInstance.clearForm();
      modalRef.componentInstance.btnText = 'Create Vendor';
    });
    
    modalRef.componentInstance.formSubmitted.subscribe(vendor => {
      this.createVendor(vendor);
      modalRef.close();
    });
  }

  createVendor(vendor: Vendor): void {
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

  listItems(): void {
    this.vendorsSvc.listVendors(this.searchCriteria).subscribe(
      (results: ApiSearchResult<Vendor>) => {
        this.items = results.data;
        this.paginator.length = results.totalRecords;
      },
      (err: any) =>{
        console.log(err);
      }
    );
  }

  private setPermissions(): void {
    this.canCreate = this.broker.hasPermission("Create");
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
        active: true,
        link: null
      }
    );
    this.crumbsSvc.update(crumbs);
  }

}
