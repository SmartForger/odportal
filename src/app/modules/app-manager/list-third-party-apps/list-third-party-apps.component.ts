import { Component, OnInit, Input } from '@angular/core';
import {App} from '../../../models/app.model';
import {Vendor} from '../../../models/vendor.model';
import {ApiSearchCriteria} from '../../../models/api-search-criteria.model';
import {SSPList} from '../../../base-classes/ssp-list';
import { ApiSearchResult } from 'src/app/models/api-search-result.model';
import {AppsService} from '../../../services/apps.service';
import { forkJoin } from 'rxjs';
import _ from 'lodash';

@Component({
  selector: 'app-list-third-party-apps',
  templateUrl: './list-third-party-apps.component.html',
  styleUrls: ['./list-third-party-apps.component.scss']
})
export class ListThirdPartyAppsComponent extends SSPList<App> implements OnInit {
  @Input() vendors: any;

  status: any;

  constructor(private appsSvc: AppsService) { 
    super(
      new Array<string>(
        "appTitle", "version", "widgets", "clientName", "vendor", "status", "actions"
      ),
      new ApiSearchCriteria(
        {appTitle: ""}, 0, "appTitle", "asc"
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

}
