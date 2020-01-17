/**
 * @description Lists approved apps and shows the enabled status for each
 * @author Steven M. Redman
 */

import { Component, OnInit, Input } from '@angular/core';
import {App} from '../../../models/app.model';
import {Vendor} from '../../../models/vendor.model';
import {ApiSearchCriteria} from '../../../models/api-search-criteria.model';
import {SSPList} from '../../../base-classes/ssp-list';
import { ApiSearchResult } from 'src/app/models/api-search-result.model';
import {AppsService} from '../../../services/apps.service';
import {VendorsService} from '../../../services/vendors.service';
import { forkJoin } from 'rxjs';
import _ from 'lodash';

@Component({
  selector: 'app-list-approved-apps',
  templateUrl: './list-approved-apps.component.html',
  styleUrls: ['./list-approved-apps.component.scss']
})
export class ListApprovedAppsComponent extends SSPList<App> implements OnInit {
  vendors: any;
  vendorCount: number;
  status: any;

  constructor(private appsSvc: AppsService, private vendorSvc: VendorsService) { 
    super(
      new Array<string>(
        "appTitle", "version", "widgets", "clientName", "vendor", "status", "actions"
      ),
      new ApiSearchCriteria(
        {appTitle: ""}, 0, "appTitle", "asc"
      )
    );
    this.searchCriteria.pageSize = 10;
    this.vendors = {};
    this.vendorCount = 0;
    this.status = {
      active: false,
      disabled: false,
      pending: false
    };
  }

  ngOnInit() {
    this.listItems();
    this.listVendors();
  }

  listItems(): void {
    this.appsSvc.listThirdPartyApps1(this.searchCriteria).subscribe(
      (results: ApiSearchResult<App>) => {
        this.items = results.data;
        this.paginator.length = results.totalRecords;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  search(searchString: string) {
    this.searchCriteria.filters.appTitle = searchString;
    this.listItems();
  }

  updateStatus() {
    let st = [];
    _.forEach(this.status, (v, k) => {
      if (v) {
        st.push(k);
      }
    });
    let str = st.length === 3 ? "" : st.join(',');
    if (this.searchCriteria.filters.status !== str) {
      this.searchCriteria.filters.status = str;
      this.listItems();
    }
  }

  protected listVendors(page = 0): void {
    this.vendorSvc.listVendors(new ApiSearchCriteria({}, page, 'name', 'asc')).subscribe(
      (result: ApiSearchResult<Vendor>) => {
        result.data.forEach((v: Vendor) => {
          this.vendors[v.docId] = v.name;
        });
        this.vendorCount += result.data.length;
        if (result.totalRecords > this.vendorCount) {
          this.listVendors(page + 1);
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
