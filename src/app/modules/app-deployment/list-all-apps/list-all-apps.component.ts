/**
 * @description Lists active vendor apps in a table. Shows which apps are enabled.
 * @author Steven M. Redman
 */

import { Component, OnInit, Input } from '@angular/core';
import { App } from '../../../models/app.model';
import { ApiSearchCriteria } from '../../../models/api-search-criteria.model';
import { SSPList } from '../../../base-classes/ssp-list';
import { ApiSearchResult } from 'src/app/models/api-search-result.model';
import { AppsService } from '../../../services/apps.service';
import _ from 'lodash';

@Component({
  selector: 'app-list-all-apps',
  templateUrl: './list-all-apps.component.html',
  styleUrls: ['./list-all-apps.component.scss']
})
export class ListAllAppsComponent extends SSPList<App> implements OnInit {

  @Input() vendorId: string;
  status: any;

  constructor(private appsSvc: AppsService) { 
    super(
      new Array<string>(
        "appTitle", "version", "clientName", "widgets", "createdAt", "actions"
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
  }

  ngOnInit() {
    this.listItems();
  }

  get totalApps() {
    let str = this.paginator.length + ' Total Microapp';
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
    this.appsSvc.listVendorApps1(this.vendorId, this.searchCriteria).subscribe(
      (results: ApiSearchResult<App>) => {
        this.items = results.data;
        this.paginator.length = results.totalRecords;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
