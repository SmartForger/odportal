/**
 * @description Lists active vendor apps in a table. Shows which apps are enabled.
 * @author Steven M. Redman
 */

import { Component, OnInit, Input } from '@angular/core';
import {App} from '../../../models/app.model';
import {ApiSearchCriteria} from '../../../models/api-search-criteria.model';
import {SSPList} from '../../../base-classes/ssp-list';
import { ApiSearchResult } from 'src/app/models/api-search-result.model';
import {AppsService} from '../../../services/apps.service';

@Component({
  selector: 'app-list-apps-active',
  templateUrl: './list-apps-active.component.html',
  styleUrls: ['./list-apps-active.component.scss']
})
export class ListAppsActiveComponent extends SSPList<App> implements OnInit {

  @Input() vendorId: string;

  constructor(private appsSvc: AppsService) { 
    super(
      new Array<string>(
        "status", "appTitle", "version", "clientName", "widgets", "uploaded", "actions"
      ),
      new ApiSearchCriteria(
        {appTitle: ""}, 0, "appTitle", "asc"
      )
    );
  }

  ngOnInit() {
    this.listItems();
  }

  protected listItems(): void {
    this.appsSvc.listVendorApps(this.vendorId, true, this.searchCriteria).subscribe(
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
