import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';

import { SSPList } from 'src/app/base-classes/ssp-list';
import { ApiSearchCriteria } from 'src/app/models/api-search-criteria.model';
import { EnvironmentsServiceService } from 'src/app/services/environments-service.service';
import { ApiSearchResult } from 'src/app/models/api-search-result.model';
import { EnvConfig } from 'src/app/models/EnvConfig.model';
import { CreateEnvConfigComponent } from '../create-env-config/create-env-config.component';

@Component({
  selector: 'app-list-all-environments',
  templateUrl: './list-all-environments.component.html',
  styleUrls: ['./list-all-environments.component.scss']
})
export class ListAllEnvironmentsComponent extends SSPList<any> {
  readonly menuOptions = [
    {
      display: 'Online',
      value: 'online'
    },
    {
      display: 'Offline',
      value: 'offline'
    },
    {
      display: 'Unclassified',
      value: 'unclassified'
    },
    {
      display: 'Secret',
      value: 'secret'
    },
    {
      display: 'Top Secret',
      value: 'topsecret'
    }
  ];
  viewMode = 'list';

  constructor(private envConfigSvc: EnvironmentsServiceService, private dialog: MatDialog) {
    super(
      new Array<string>(
        "name", "classification", "ownerName", "supportEmail", "activeSessions", "status", "actions"
      ),
      new ApiSearchCriteria(
        { search: "", status: "", classification: "" }, 0, "appTitle", "asc"
      )
    );
    this.searchCriteria.pageSize = 10;
  }

  ngOnInit() {
    this.listItems();
  }

  create() {
    let modalRef: MatDialogRef<CreateEnvConfigComponent> = this.dialog.open(CreateEnvConfigComponent);
    modalRef.afterClosed().subscribe((data: EnvConfig) => {
      if (data) {
        this.envConfigSvc.create(data).subscribe(
          () => {
            this.listItems();
          }
        )
      }
    });
  }

  search(search: string) {
    this.searchCriteria.filters.search = search;
    this.listItems();
  }

  refresh() {
    this.listItems();
  }

  updateMenuFilter(menus: string[]) {
    const status = this.filterMenus(menus, ["online", "offline"]);
    const classification = this.filterMenus(menus, ["unclassified", "secret", "topsecret"]);

    this.searchCriteria.filters.status = status;
    this.searchCriteria.filters.classification = classification;
    this.listItems();
  }

  updateStatus(status: string) {
    this.searchCriteria.filters.status = status;
    this.searchCriteria.pageIndex = 0;
    this.listItems();
  }

  viewModeChange(mode: string) {
    this.viewMode = mode;
  }

  get totalEnvironments() {
    let str = `${this.paginator.length} Total Environments`;
    return this.paginator.length > 1 ? str + 's' : str;
  }

  protected listItems(): void {
    this.envConfigSvc.getList(this.searchCriteria).subscribe(
      (results: ApiSearchResult<EnvConfig>) => {
        this.items = results.data;
        this.paginator.length = results.totalRecords;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private filterMenus(selected: string[], checkItems: string[]): string {
    let result = '';
    let count = 0;
    checkItems.forEach(item => {
      if (selected.indexOf(item) >= 0) {
        result += item;
        count ++;
      }
    });
    if (count === checkItems.length) {
      result = '';
    }

    return result;
  }
}