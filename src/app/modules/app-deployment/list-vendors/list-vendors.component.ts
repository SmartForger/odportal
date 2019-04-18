/**
 * @description Lists vendors to which the logged-in user is assigned
 * @author Steven M. Redman
 */

import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import {Vendor} from '../../../models/vendor.model';
import {VendorsService} from '../../../services/vendors.service';
import {AuthService} from '../../../services/auth.service';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {Subscription} from 'rxjs';
import {ApiSearchCriteria} from '../../../models/api-search-criteria.model';
import {ApiSearchResult} from '../../../models/api-search-result.model';

@Component({
  selector: 'app-list-vendors',
  templateUrl: './list-vendors.component.html',
  styleUrls: ['./list-vendors.component.scss']
})
export class ListVendorsComponent implements OnInit, AfterViewInit, OnDestroy {

  vendors: Array<Vendor>;
  totalVendors: number;
  displayedColumns: Array<string>;
  searchCriteria: ApiSearchCriteria;
  private sortSub: Subscription;
  private paginatorSub: Subscription;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private vendorsSvc: VendorsService, 
    private authSvc: AuthService,
    private crumbsSvc: BreadcrumbsService) { 
      this.vendors = new Array<Vendor>();
      this.totalVendors = 0;
      this.displayedColumns = new Array<string>(
        "name", "phone", "email", "users", "created", "actions"
      );
      this.searchCriteria = new ApiSearchCriteria(
        {name: ""}, 0, "name", "asc"
      );
    }

  ngOnInit() {
    this.listVendors();
    this.generateCrumbs();
  }

  ngAfterViewInit() {
    this.subscribeToSort();
    this.subscribeToPaging();
  }

  ngOnDestroy() {
    if (this.sortSub) {
      this.sortSub.unsubscribe();
    }
    if (this.paginatorSub) {
      this.paginatorSub.unsubscribe();
    }
  }

  applyFilter(vendorName: string): void {
    this.paginator.pageIndex = 0;
    this.searchCriteria.pageIndex = 0;
    this.searchCriteria.filters.name = vendorName;
    this.listVendors();
  }

  private subscribeToSort(): void {
    this.sortSub = this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.searchCriteria.pageIndex = 0;
      this.searchCriteria.sortColumn = this.sort.active;
      this.searchCriteria.sortOrder = this.sort.direction;
      this.listVendors();
    });
  }

  private subscribeToPaging(): void {
    this.paginatorSub = this.paginator.page.subscribe(() => {
      this.searchCriteria.pageIndex = this.paginator.pageIndex;
      this.listVendors();
    });
  }

  private listVendors(): void {
    this.vendorsSvc.listVendorsByUserId(this.authSvc.getUserId(), this.searchCriteria).subscribe(
      (results: ApiSearchResult<Vendor>) => {
        this.vendors = results.data;
        this.totalVendors = results.totalRecords;
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
        active: true,
        link: null
      }
    );
    this.crumbsSvc.update(crumbs);
  }

}
