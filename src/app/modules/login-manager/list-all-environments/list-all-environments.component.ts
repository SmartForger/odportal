import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';

import { SSPList } from 'src/app/base-classes/ssp-list';
import { ApiSearchCriteria } from 'src/app/models/api-search-criteria.model';
import { EnvironmentsServiceService } from 'src/app/services/environments-service.service';
import { ApiSearchResult } from 'src/app/models/api-search-result.model';
import { EnvConfig } from 'src/app/models/EnvConfig.model';
import { CreateEnvConfigComponent } from '../create-env-config/create-env-config.component';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { NotificationService } from '../../../notifier/notification.service';
import { NotificationType } from '../../../notifier/notificiation.model';

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
  readonly clsMap = {
    secret: 'SECRET',
    unclassified: 'UNCLASSIFIED',
    topsecret: 'TOP SECRET'
  };
  viewMode = 'list';

  constructor(
    private envConfigSvc: EnvironmentsServiceService,
    private notificationsSvc: NotificationService,
    private dialog: MatDialog
  ) {
    super(
      new Array<string>(
        "name", "classification", "ownerName", "activeSessions", "status", "actions"
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

  isUkiOpendash(item: EnvConfig) {
    return item.boundUrl === 'https://pcte.opendash360.com';
  }

  deleteConfig(item: EnvConfig) {
    let modalRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: "Delete environment",
        subtitle: "Are you sure you want to delete this environment?",
        submitButtonTitle: "Delete",
        submitButtonClass: "bg-red",
        formFields: [
          {
            type: "static",
            label: "Name",
            defaultValue: item.name
          },
          {
            type: "static",
            label: "Classification",
            defaultValue: item.classification
          }
        ]
      }
    });

    modalRef.afterClosed().subscribe(data => {
      if(data){
        this.envConfigSvc.delete(item.docId)
          .subscribe(
            () => {
              this.refresh();
              this.notificationsSvc.notify({
                type: NotificationType.Success,
                message: item.name + " was deleted successfuly"
              });
            },
            () => {
              this.notificationsSvc.notify({
                type: NotificationType.Error,
                message: `An error occurred while deleting ${item.name}`
              });
            }
          );
      }
    });
  }

  protected listItems(): void {
    this.envConfigSvc.getList(this.searchCriteria).subscribe(
      (results: ApiSearchResult<EnvConfig>) => {
        this.items = results.data;
        this.items.forEach(item => {
          if (item.name === 'UKIOpenDash360 (current)') {
            item.status = 'online';
            item.activeSessions = 54;
          }
        });
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
