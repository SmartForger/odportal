import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppsService } from '../../../services/apps.service';
import { App } from '../../../models/app.model';
import { NotificationService } from '../../../notifier/notification.service';
import { NotificationType } from '../../../notifier/notificiation.model';
import { Role } from '../../../models/role.model';
import { RolesService } from '../../../services/roles.service';
import { Cloner } from '../../../util/cloner';
import { Filters } from '../../../util/filters';
import { AppWithPermissions } from '../../../models/app-with-permissions.model';
import { AuthService } from '../../../services/auth.service';
import {
  MatSort,
  MatPaginator,
  MatDialogRef,
  MatDialog,
} from '@angular/material';
import { PermissionsModalComponent } from '../../display-elements/permissions-modal/permissions-modal.component';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { TableSelectionService } from 'src/app/services/table-selection.service';
import { VendorsService } from 'src/app/services/vendors.service';
import { ApiSearchResult } from 'src/app/models/api-search-result.model';
import { ApiSearchCriteria } from 'src/app/models/api-search-criteria.model';
import { Vendor } from 'src/app/models/vendor.model';

@Component({
  selector: 'app-app-mapper',
  templateUrl: './app-mapper.component.html',
  styleUrls: ['./app-mapper.component.scss'],
})
export class AppMapperComponent implements OnInit, OnDestroy {
  apps: Array<AppWithPermissions>;
  showPermissionsModal: boolean;
  activeAwp: AppWithPermissions;
  activeAwpMods: Array<AppWithPermissions>;

  @Input() activeRole: Role;
  @Input() displayedColumns: Array<string>;
  @Input() useNativeFilter: boolean;

  vendors: any;
  vendorCount: number;

  items: Array<AppWithPermissions>;
  filteredItems: Array<AppWithPermissions>;
  filters: any;
  viewMode: string;
  protected sortSub: Subscription;
  protected paginatorSub: Subscription;
  selectedItems: Object;
  selectedCount: number;
  selectionSub: Subscription;

  selection = {
    assigned: [],
    unassigned: [],
  };

  readonly menuOptions = [
    {
      display: 'Assigned',
      value: 'assigned',
    },
    {
      display: 'Unassigned',
      value: 'unassigned',
    },
  ];

  private _canUpdate: boolean;
  @Input('canUpdate')
  get canUpdate(): boolean {
    return this._canUpdate;
  }
  set canUpdate(canUpdate: boolean) {
    this._canUpdate = canUpdate;
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private vendorSvc: VendorsService,
    private appsSvc: AppsService,
    private notifySvc: NotificationService,
    private rolesSvc: RolesService,
    private authSvc: AuthService,
    private dialog: MatDialog,
    private selectionSvc: TableSelectionService
  ) {
    this.vendors = {};
    this.vendorCount = 0;
    this.showPermissionsModal = false;
    this.canUpdate = true;
    this.displayedColumns = [
      // 'selection',
      'appTitle',
      'version',
      'widgets',
      'clientName',
      'vendor',
      'status',
      'assigned',
      'actions',
    ];
    this.filters = {
      appTitle: '',
      selected: [],
    };
    this.apps = [];
    this.filteredItems = [];
    this.useNativeFilter = false;
    this.selectedItems = {};
    this.selectionSvc.setCompareField('docId');
    this.selectionSvc.resetSelection();
  }

  ngOnInit() {
    this.listVendors();
    this.listApps();
    this.filterItems();
    this.sortItems();
    this.paginateItems();
    this.subscribeToPaging();
    this.subscribeToSort();
    this.selectionSub = this.selectionSvc.selection.subscribe((selected) => {
      this.selectedItems = selected;
      this.selectedCount = this.selectionSvc.getSelectedCount();

      const selectedApps = this.selectionSvc.getSelectedItems();
      this.selection.assigned = selectedApps.filter((app: App) => app.active);
      this.selection.unassigned = selectedApps.filter(
        (app: App) => !app.active
      );
    });
  }

  ngOnDestroy() {
    this.sortSub.unsubscribe();
    this.paginatorSub.unsubscribe();
    this.selectionSub.unsubscribe();
  }

  protected subscribeToSort(): void {
    this.sortSub = this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.sortItems();
      this.paginateItems();
    });
  }

  protected subscribeToPaging(): void {
    this.paginatorSub = this.paginator.page.subscribe(() => {
      this.paginateItems();
    });
  }

  private listApps(): void {
    this.appsSvc.listApps().subscribe(
      (apps: Array<App>) => {
        this.apps = apps.map((app: App) => {
          return { app: app };
        });
        this.listRoleApps();
        // this.getAppClientPermissions();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private listRoleApps(): void {
    this.appsSvc.listRoleApps(this.activeRole.id).subscribe(
      (apps: Array<App>) => {
        this.setActiveApps(apps);
        this.filterItems();
        this.sortItems();
        this.paginateItems();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private setActiveApps(roleApps: Array<App>): void {
    this.apps.forEach((awp: AppWithPermissions) => {
      const roleApp: App = roleApps.find((a: App) => a.docId === awp.app.docId);
      if (roleApp) {
        awp.app.active = true;
      }
    });
  }

  removeAppFromRole(awp: AppWithPermissions, ev: Event): void {
    ev.stopPropagation();

    this.activeAwp = awp;

    const dialogRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(
      PlatformModalComponent,
      {
        data: {
          type: PlatformModalType.SECONDARY,
          title: 'Remove App from Role',
          subtitle: 'Are you sure you want to remove this app',
          submitButtonTitle: 'Remove',
          submitButtonClass: 'bg-red',
          formFields: [
            {
              type: 'static',
              label: 'App Title',
              defaultValue: this.activeAwp.app.appTitle,
            },
            {
              type: 'static',
              label: 'Role Name',
              defaultValue: this.activeRole.name,
            },
          ],
        },
      }
    );

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        const index: number = this.activeAwp.app.roles.indexOf(
          this.activeRole.id
        );
        this.activeAwp.app.roles.splice(index, 1);
        this.appsSvc.update(this.activeAwp.app).subscribe(
          (app: App) => {
            this.activeAwp.app.active = false;
            this.notifySvc.notify({
              type: NotificationType.Success,
              message:
                this.activeAwp.app.appTitle + ' was removed from this role',
            });
            this.appsSvc.appUpdated(app);
            const roles: Array<Role> = new Array<Role>();
            this.activeAwp.permissions.forEach((p: Role) => {
              p.active = false;
              roles.push(p);
            });
            this.deleteComposites(roles);
            const rolesToDelete: Array<Role> = Filters.removeArrayObjectKeys<
              Role
            >(
              ['active'],
              Cloner.cloneObjectArray<Role>(
                this.activeAwp.permissions.filter((role: Role) => !role.active)
              )
            );
            this.deleteComposites(rolesToDelete);
          },
          (err: any) => {
            this.notifySvc.notify({
              type: NotificationType.Error,
              message:
                'There was a problem while removing ' +
                this.activeAwp.app.appTitle +
                ' from this role',
            });
          }
        );
      }
    });
  }

  addAppToRole(awp: AppWithPermissions, ev: Event): void {
    ev.stopPropagation();

    this.activeAwp = awp;

    const dialogRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(
      PlatformModalComponent,
      {
        data: {
          type: PlatformModalType.SECONDARY,
          title: 'Add App to Role',
          subtitle: 'Are you sure you want to add this app',
          submitButtonTitle: 'Add',
          formFields: [
            {
              type: 'static',
              label: 'App Title',
              defaultValue: this.activeAwp.app.appTitle,
            },
            {
              type: 'static',
              label: 'Role Name',
              defaultValue: this.activeRole.name,
            },
          ],
        },
      }
    );

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.activeAwp.app.roles.push(this.activeRole.id);
        this.appsSvc.update(this.activeAwp.app).subscribe(
          (app: App) => {
            this.activeAwp.app.active = true;
            this.notifySvc.notify({
              type: NotificationType.Success,
              message: this.activeAwp.app.appTitle + ' was added to this role',
            });
            this.appsSvc.appUpdated(app);
            this.updatePermissions(this.activeAwp);
          },
          (err: any) => {
            this.notifySvc.notify({
              type: NotificationType.Error,
              message:
                'There was a problem while adding ' +
                this.activeAwp.app.appTitle +
                ' to this role',
            });
          }
        );
      }
    });
  }

  updatePermissions(awp: AppWithPermissions, ev?: Event): void {
    if (ev) {
      ev.stopPropagation();
    }

    this.activeAwp = Cloner.cloneObject<AppWithPermissions>(awp);

    const modelRef = this.dialog.open(PermissionsModalComponent, {
      data: {
        xwp: this.activeAwp,
        clientName: this.activeAwp.app.clientName,
      },
    });

    modelRef.componentInstance.objectTitle = this.activeAwp.app.appTitle;
    modelRef.componentInstance.clientName = this.activeAwp.app.clientName;
    modelRef.componentInstance.objectWithPermissions = this.activeAwp;

    modelRef.componentInstance.saveChanges.subscribe((saveChanges) => {
      if (saveChanges) {
        if (!this.activeAwp.permissions) {
          this.activeAwp.permissions = [];
        }
        const rolesToAdd: Array<Role> = Filters.removeArrayObjectKeys<Role>(
          ['active'],
          Cloner.cloneObjectArray<Role>(
            this.activeAwp.permissions.filter((r: Role) => r.active)
          )
        );
        const rolesToDelete: Array<Role> = Filters.removeArrayObjectKeys<Role>(
          ['active'],
          Cloner.cloneObjectArray<Role>(
            this.activeAwp.permissions.filter((role: Role) => !role.active)
          )
        );
        this.addComposites(
          Cloner.cloneObjectArray<Role>(rolesToAdd),
          rolesToDelete
        );
        rolesToAdd.forEach((role: Role) => (role.active = true));
        const awps: Array<AppWithPermissions> = this.apps.filter(
          (awp: AppWithPermissions) =>
            awp.app.clientId === this.activeAwp.app.clientId
        );
        awps.forEach((awp: AppWithPermissions) => {
          awp.permissions = rolesToAdd.concat(rolesToDelete);
        });
      } else {
        this.activeAwp = Cloner.cloneObject<AppWithPermissions>(awp);
      }
      modelRef.close();
    });
  }

  private addComposites(roles: Array<Role>, inactiveRoles: Array<Role>): void {
    this.rolesSvc.addComposites(this.activeRole.id, roles).subscribe(
      (response: any) => {
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: 'Roles were added successfully to ' + this.activeRole.name,
        });
        this.deleteComposites(inactiveRoles);
      },
      (err: any) => {
        console.log(err);
        this.notifySvc.notify({
          type: NotificationType.Error,
          message:
            'There was a problem while adding roles to ' + this.activeRole.name,
        });
      }
    );
  }

  private deleteComposites(roles: Array<Role>): void {
    this.rolesSvc.deleteComposites(this.activeRole.id, roles).subscribe(
      (response: any) => {
        this.notifySvc.notify({
          type: NotificationType.Success,
          message:
            'Roles were removed successfully from ' + this.activeRole.name,
        });
        this.authSvc.updateUserSession(true);
      },
      (err: any) => {
        console.log(err);
        this.notifySvc.notify({
          type: NotificationType.Error,
          message:
            'There was a problem while removing roles from ' +
            this.activeRole.name,
        });
      }
    );
  }

  protected listVendors(page = 0): void {
    this.vendorSvc
      .listVendors(new ApiSearchCriteria({}, page, 'name', 'asc'))
      .subscribe(
        (result: ApiSearchResult<Vendor>) => {
          result.data.forEach((v: Vendor) => {
            this.vendors[v.docId] = v.name;
          });
          this.vendorCount += result.data.length;
          if (result.totalRecords > this.vendorCount) {
            this.listVendors(page + 1);
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  refresh() {
    this.listApps();
  }

  refreshItems(resetPage = false) {
    this.filterItems();
    this.sortItems();

    if (resetPage) {
      this.paginator.pageIndex = 0;
    }
    this.paginateItems();
  }

  search(searchString: string) {
    this.filters.appTitle = searchString.toLowerCase();
    this.refreshItems(true);
  }

  private sortItems() {
    this.filteredItems.sort((a: AppWithPermissions, b: AppWithPermissions) => {
      let valA: string;
      let valB: string;
      if (['appTitle', 'clientName'].indexOf(this.sort.active) >= 0) {
        valA = a.app[this.sort.active] || '';
        valB = b.app[this.sort.active] || '';
      } else if (this.sort.active === 'status') {
        valA = this.getStatus(a.app);
        valB = this.getStatus(b.app);
      } else if (this.sort.active === 'vendor') {
        valA = this.vendors[a.app.vendorId] || '';
        valB = this.vendors[b.app.vendorId] || '';
      } else if (this.sort.active === 'assigned') {
        valA = a.app.active ? '0' : '1';
        valB = b.app.active ? '0' : '1';
      }

      return this.sort.direction === 'asc'
        ? valA.localeCompare(valB)
        : -valA.localeCompare(valB);
    });
  }

  private getStatus(app: App): string {
    if (app.approved && app.enabled) {
      return 'active';
    } else if (app.approved && !app.enabled) {
      return 'disabled';
    } else {
      return 'pending';
    }
  }

  private paginateItems() {
    this.items = this.filteredItems.slice(
      this.paginator.pageIndex * this.paginator.pageSize,
      (this.paginator.pageIndex + 1) * this.paginator.pageSize
    );
  }

  updateMenuFilter(menus: string[]) {
    this.filters.selected = menus;
    this.refreshItems(true);
  }

  isAllSelected() {
    let result = true;
    this.items.forEach((item) => {
      result = this.selectedItems[item.app.docId] && result;
    });
    return result;
  }

  toggleAllSelection() {
    const selected = this.isAllSelected();
    this.selectionSvc.selectBatch(
      this.items.map((a) => a.app),
      !selected
    );
  }

  private filterItems() {
    const { appTitle } = this.filters;
    const titleFilter = (app: App) =>
      !appTitle || app.appTitle.toLowerCase().indexOf(appTitle) >= 0;
    const selected = this.filters.selected.reduce(
      (obj, item) => ({
        ...obj,
        [item]: true,
      }),
      {}
    );
    const assignFilter = (app: App) =>
      (!selected.assigned && !selected.unassigned) ||
      (selected.assigned && app.active) ||
      (selected.unassigned && !app.active);

    this.filteredItems = this.apps.filter(
      (awp) => titleFilter(awp.app) && assignFilter(awp.app)
    );
    this.paginator.length = this.filteredItems.length;
  }
}
