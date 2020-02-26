/**
 * @description Lists active vendor apps in a table. Shows which apps are enabled.
 * @author Steven M. Redman
 */

import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import {App} from '../../../models/app.model';
import {ApiSearchCriteria} from '../../../models/api-search-criteria.model';
import {SSPList} from '../../../base-classes/ssp-list';
import { ApiSearchResult } from 'src/app/models/api-search-result.model';
import {AppsService} from '../../../services/apps.service';
import _ from 'lodash';
import { Vendor } from 'src/app/models/vendor.model';

@Component({
  selector: 'app-list-apps-active',
  templateUrl: './list-apps-active.component.html',
  styleUrls: ['./list-apps-active.component.scss']
})
export class ListAppsActiveComponent extends SSPList<App> implements OnInit {

  @Input() vendor: Vendor;
  status: any;
  vendorMap: Object;
  viewMode: string;

  constructor(private appsSvc: AppsService) { 
    super(
      new Array<string>(
        "appTitle", "version", "clientName", "widgets", "createdAt", "actions"
      ),
      new ApiSearchCriteria(
        {appTitle: ""}, 0, "appTitle", "asc"
      )
    );
    this.searchCriteria.pageSize = 10;
    this.status = {
      active: false,
      disabled: false
    };

    this.vendor = {
      name: '',
      pocEmail: '',
      pocPhone: ''
    };
  }

  ngOnInit() {
    this.listItems();
    this.vendorMap = {
      [this.vendor.docId]: this.vendor.name
    };
  }

  get totalApps() {
    let str = this.paginator.length + ' Total Active Microapp';
    return this.paginator.length > 1 ? str + 's' : str;
  }

  updateStatus() {
    let statusArr = [];
    _.forEach(this.status, (v, k) => {
      if (v) {
        statusArr.push(k);
      }
    });

    this.searchCriteria.filters.status = statusArr.join(',');
    this.listItems();
  }

  listItems(): void {
    this.appsSvc.listVendorApps(this.vendor.docId, 'approved', this.searchCriteria).subscribe(
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
