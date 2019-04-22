import { Component, OnInit, Input } from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {App} from '../../../models/app.model';
import {ApiSearchCriteria} from '../../../models/api-search-criteria.model';
import {SSPList} from '../../../base-classes/ssp-list';
import { ApiSearchResult } from 'src/app/models/api-search-result.model';

@Component({
  selector: 'app-view-apps',
  templateUrl: './view-apps.component.html',
  styleUrls: ['./view-apps.component.scss']
})
export class ViewAppsComponent extends SSPList<App> implements OnInit {

  findApproved: boolean;
  @Input() vendorId: string;

  constructor(private appsSvc: AppsService) { 
    super(
      new Array<string>(
        "status", "appTitle", "version", "clientName", "widgets", "uploaded"
      ),
      new ApiSearchCriteria(
        {appTitle: ""}, 0, "appTitle", "asc"
      )
    ); 
    this.findApproved = true; 
  }

  ngOnInit() {
    this.listItems();
  }

  searchUpdated(searchOptions: any): void {
    this.findApproved = searchOptions.dropdownValue;
    this.applyFilter("appTitle", searchOptions.queryValue);
  }

  protected listItems(): void {
    this.appsSvc.listVendorApps(this.vendorId, this.findApproved, this.searchCriteria).subscribe(
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
