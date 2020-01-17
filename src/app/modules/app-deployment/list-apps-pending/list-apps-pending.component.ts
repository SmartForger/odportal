/**
 * @description Lists vendor pending apps and displays them in a table
 * @author Steven M. Redman
 */

import { Component, OnInit, Input } from '@angular/core';
import {App} from '../../../models/app.model';
import {ApiSearchCriteria} from '../../../models/api-search-criteria.model';
import {SSPList} from '../../../base-classes/ssp-list';
import { ApiSearchResult } from 'src/app/models/api-search-result.model';
import {AppsService} from '../../../services/apps.service';

@Component({
  selector: 'app-list-apps-pending',
  templateUrl: './list-apps-pending.component.html',
  styleUrls: ['./list-apps-pending.component.scss']
})
export class ListAppsPendingComponent extends SSPList<App> implements OnInit {

  @Input() vendorId: string;

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
  }

  ngOnInit() {
    this.listItems();
  }

  get totalApps() {
    let str = this.paginator.length + ' Total Pending Microapp';
    return this.paginator.length > 1 ? str + 's' : str;
  }

  protected listItems(): void {
    this.appsSvc.listVendorApps(this.vendorId, false, this.searchCriteria).subscribe(
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
