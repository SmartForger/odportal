/**
 * @description Lists active vendor apps in a table. Shows which apps are enabled.
 * @author Steven M. Redman
 */

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { App } from '../../../models/app.model';
import { ApiSearchCriteria } from '../../../models/api-search-criteria.model';
import { SSPList } from '../../../base-classes/ssp-list';
import { ApiSearchResult } from 'src/app/models/api-search-result.model';
import { AppsService } from '../../../services/apps.service';
import _ from 'lodash';
import { Vendor } from 'src/app/models/vendor.model';

@Component({
  selector: 'app-list-all-apps',
  templateUrl: './list-all-apps.component.html',
  styleUrls: ['./list-all-apps.component.scss']
})
export class ListAllAppsComponent extends SSPList<App> implements OnInit {

  @Input() vendor: Vendor;
  @Output() upload: EventEmitter<any>;

  status: any;
  viewMode: string;
  vendorMap: Object;

  readonly menuOptions = [
    {
      display: "Active",
      value: "active"
    },
    {
      display: "Disabled",
      value: "disabled"
    },
    {
      display: "Pending",
      value: "pending"
    }
  ];

  constructor(private appsSvc: AppsService) { 
    super(
      new Array<string>(
        "appTitle", "version", "widgets", "clientName", "vendor", "status", "actions"
      ),
      new ApiSearchCriteria(
        {appTitle: "", status: ""}, 0, "appTitle", "asc"
      )
    );
    this.searchCriteria.pageSize = 10;
    this.status = {
      active: false,
      disabled: false,
      pending: false
    };
    this.vendor = {
      name: '',
      pocEmail: '',
      pocPhone: ''
    };
    this.upload = new EventEmitter();
  }

  ngOnInit() {
    this.listItems();
    this.vendorMap = {
      [this.vendor.docId]: this.vendor.name
    };
  }

  get totalApps() {
    let str = this.paginator.length + ' Total Microapp';
    return this.paginator.length > 1 ? str + 's' : str;
  }

  updateStatus(statusArr: string[]) {
    this.searchCriteria.filters.status = statusArr.join(',');
    this.listItems();
  }

  listItems(): void {
    this.appsSvc.listVendorApps1(this.vendor.docId, this.searchCriteria).subscribe(
      (results: ApiSearchResult<App>) => {
        this.items = results.data;
        this.paginator.length = results.totalRecords;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  viewModeChange(mode: string): void {
    this.viewMode = mode;
  }

}
