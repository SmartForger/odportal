/**
 * @description Lists approved apps and shows the enabled status for each
 * @author Steven M. Redman
 */

import { Component, OnInit, Input } from '@angular/core';
import {App} from '../../../models/app.model';
import {ApiSearchCriteria} from '../../../models/api-search-criteria.model';
import {SSPList} from '../../../base-classes/ssp-list';
import { ApiSearchResult } from 'src/app/models/api-search-result.model';
import {AppsService} from '../../../services/apps.service';

@Component({
  selector: 'app-list-approved-apps',
  templateUrl: './list-approved-apps.component.html',
  styleUrls: ['./list-approved-apps.component.scss']
})
export class ListApprovedAppsComponent extends SSPList<App> implements OnInit {

  constructor(private appsSvc: AppsService) { 
    super(
      new Array<string>(
        "appTitle", "version", "type", "clientName", "widgets", "status", "actions"
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
    this.appsSvc.listThirdPartyApps(true, this.searchCriteria).subscribe(
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
