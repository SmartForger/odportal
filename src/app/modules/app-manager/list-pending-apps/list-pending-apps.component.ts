/**
 * @description Lists pending apps and displays an icon representing whether each is enables/disabled
 * @author Steven M. Redman
 */

import { Component, OnInit, Input } from '@angular/core';
import {App} from '../../../models/app.model';
import {ApiSearchCriteria} from '../../../models/api-search-criteria.model';
import {SSPList} from '../../../base-classes/ssp-list';
import { ApiSearchResult } from 'src/app/models/api-search-result.model';
import {AppsService} from '../../../services/apps.service';

@Component({
  selector: 'app-list-pending-apps',
  templateUrl: './list-pending-apps.component.html',
  styleUrls: ['./list-pending-apps.component.scss']
})
export class ListPendingAppsComponent extends SSPList<App> implements OnInit {

  constructor(private appsSvc: AppsService) { 
    super(
      new Array<string>(
        "status", "appTitle", "version", "type", "clientName", "widgets", "actions"
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
    this.appsSvc.listThirdPartyApps(false, this.searchCriteria).subscribe(
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
