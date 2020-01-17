/**
 * @description Lists native apps and shows an icon representing if it is enabled/disabled
 * @author Steven M. Redman
 */

import { Component, OnInit } from '@angular/core';
import {App} from '../../../models/app.model';
import {ApiSearchCriteria} from '../../../models/api-search-criteria.model';
import {SSPList} from '../../../base-classes/ssp-list';
import { ApiSearchResult } from 'src/app/models/api-search-result.model';
import {AppsService} from '../../../services/apps.service';
import _ from 'lodash';

@Component({
  selector: 'app-list-native-apps',
  templateUrl: './list-native-apps.component.html',
  styleUrls: ['./list-native-apps.component.scss']
})
export class ListNativeAppsComponent extends SSPList<App> implements OnInit {
  status: any;

  constructor(private appsSvc: AppsService) { 
    super(
      new Array<string>(
        "appTitle", "widgets", "clientName", "status", "actions"
      ),
      new ApiSearchCriteria(
        {appTitle: ""}, 0, "appTitle", "asc"
      )
    );

    this.status = {
      active: false,
      disabled: false
    };
  }

  ngOnInit() {
    this.listItems();
  }

  search(searchString: string) {
    this.searchCriteria.filters.appTitle = searchString;
    this.listItems();
  }

  listItems(): void {
    this.appsSvc.listNativeApps(this.searchCriteria).subscribe(
      (results: ApiSearchResult<App>) => {
        this.items = results.data;
        this.paginator.length = results.totalRecords;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  updateStatus() {
    let st = [];
    _.forEach(this.status, (v, k) => {
      if (v) {
        st.push(k);
      }
    });
    let str = st.length === 2 ? "" : st.join(',');
    if (this.searchCriteria.filters.status !== str) {
      this.searchCriteria.filters.status = str;
      this.listItems();
    }
  }
}
