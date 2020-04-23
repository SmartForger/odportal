import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MatSort } from '@angular/material';
import {Vendor} from '../../../models/vendor.model';
import {VendorsService} from '../../../services/vendors.service';
import { AppPermissionsBroker } from 'src/app/util/app-permissions-broker';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';
import {ApiSearchCriteria} from '../../../models/api-search-criteria.model';
import { DirectQueryList } from 'src/app/base-classes/direct-query-list';
import { ApiSearchResult } from 'src/app/models/api-search-result.model';
import { AuthService } from 'src/app/services/auth.service';
import { AddVendorComponent } from '../add-vendor/add-vendor.component';
import { Observable } from 'rxjs';
import { UserProfileKeycloak } from 'src/app/models/user-profile.model';
import { Filters } from 'src/app/util/filters';

@Component({
  selector: 'app-list-vendors',
  templateUrl: './list-vendors.component.html',
  styleUrls: ['./list-vendors.component.scss']
})
export class ListVendorsComponent extends DirectQueryList<Vendor> implements OnInit {

  broker: AppPermissionsBroker;
  canCreate: boolean;
  fileBasePath: string;
  searchCriteria: ApiSearchCriteria;

  @ViewChild(AddVendorComponent) vendorForm: AddVendorComponent;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private vendorsSvc: VendorsService,
    private notifySvc: NotificationService,
    private crumbsSvc: BreadcrumbsService,
    private router: Router,
    private dialog: MatDialog,
    private authSvc: AuthService) {
      super(new Array<string>("name", "phone", "email", "users", "actions"));

      this.broker = new AppPermissionsBroker("vendor-manager");
      this.canCreate = false;
      this.fileBasePath = this.authSvc.globalConfig.vendorsServiceConnection + 'logos/';
      this.searchCriteria = new ApiSearchCriteria(
        {name: ""}, 0, "name", "asc"
      );

      this.query = function(first: number, max: number) {
        return new Observable<Array<Vendor>>(observer => {
          this.vendorsSvc.listVendors(this.searchCriteria).subscribe(
            (results: ApiSearchResult<Vendor>) => {
              observer.next(results.data);
              observer.complete();
            },
            (err: any) =>{
              observer.error(err);
              observer.complete();
            }
          );
        });
      }.bind(this);
  }

  ngOnInit() {
    this.fetchAll();
    this.setPermissions();
    this.generateCrumbs();
  }

  showCreateModal(): void {
    let modalRef: MatDialogRef<AddVendorComponent> = this.dialog.open(AddVendorComponent, {

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

  filterUsers(keyword: string): void {
    if(this.allItemsFetched){
      const filterKeys = ['name'];
      this.filteredItems = Filters.filterByKeyword(filterKeys, keyword, this.items);
      this.page = 0;
      this.listDisplayItems();
    }
  }

  protected filterItems(): void{
    if(this.allItemsFetched){
      if(this.sortColumn === '') {
        this.sortColumn = 'name';
      }
      this.filteredItems.sort((a: Vendor, b: Vendor) => {
        const sortOrder = this.sort.direction === 'desc' ? -1 : 1;
        if (this.sortColumn === 'users') {
          return a.users.length < b.users.length ? -1 * sortOrder : sortOrder;
        } else {
          return a[this.sortColumn] < b[this.sortColumn] ? -1 * sortOrder : sortOrder;
        }
      });
    }
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
