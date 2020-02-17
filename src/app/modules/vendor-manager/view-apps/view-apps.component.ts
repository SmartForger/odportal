import { Component, Input } from '@angular/core';
import { MatSort } from '@angular/material';
import { Observable } from 'rxjs';
import {AppsService} from '../../../services/apps.service';
import {App} from '../../../models/app.model';
import {DirectQueryList} from '../../../base-classes/direct-query-list';
import { ApiSearchResult } from 'src/app/models/api-search-result.model';
import { ApiSearchCriteria } from '../../../models/api-search-criteria.model';
import { Filters } from 'src/app/util/filters';
import { KeyValue } from 'src/app/models/key-value.model';

@Component({
  selector: 'app-view-apps',
  templateUrl: './view-apps.component.html',
  styleUrls: ['./view-apps.component.scss']
})
export class ViewAppsComponent extends DirectQueryList<App> {

  @Input() vendorId: string;
  type: string;
  searchCriteria: ApiSearchCriteria;
  menuOptions: Array<KeyValue>;

  constructor(private appsSvc: AppsService) {
    
    super(new Array<string>("appTitle", "version", "clientName", "widgets", "uploaded", "status"));
    
    this.type = 'approved';
    this.searchCriteria = new ApiSearchCriteria(
      {appTitle: ""}, 0, "appTitle", "asc"
    );
    this.menuOptions = new Array<KeyValue>();
    this.menuOptions.push({
      display: 'Approved',
      value: 'approved',
    },
    {
      display: 'Pending',
      value: 'pending',
    },
    {
      display: 'Active',
      value: 'active',
    },
    {
      display: 'Disabled',
      value: 'disabled',
    });

    this.query = function(first: number, max: number) {
      return new Observable<Array<App>>(observer => {
        this.appsSvc.listVendorApps(this.vendorId, this.type, this.searchCriteria).subscribe(
          (results: ApiSearchResult<App>) => {
            observer.next(results.data);
            observer.complete();
          },
          (err: any) => {
            observer.error(err);
            observer.complete();
          }
        );
      });
    }.bind(this);
  }

  protected filterItems(): void{
    if(this.allItemsFetched){
      if(this.sortColumn === '') {
        this.sortColumn = 'appTitle';
      }
      this.filteredItems.sort((a: App, b: App) => {
        const sortOrder = this.sort.direction === 'desc' ? -1 : 1;
        return a[this.sortColumn] < b[this.sortColumn] ? -1 * sortOrder : sortOrder;
      });
    }
  }

  filterApps(keyword: string): void {
    if(this.allItemsFetched){
      const filterKeys = ['appTitle'];
      this.filteredItems = Filters.filterByKeyword(filterKeys, keyword, this.items);
      this.page = 0;
      this.listDisplayItems();
    }
  }

  selectRole(role: string): void {
    this.type = role;
    this.refresh();
  }
}
