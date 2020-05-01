import {
  Component,
  OnChanges,
  OnInit,
  OnDestroy,
  Input,
  SimpleChanges,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatSort, MatPaginator, MatDialogRef, MatDialog } from '@angular/material';
import { Subscription, of, concat } from 'rxjs';
import { map, catchError, toArray } from 'rxjs/operators';
import _ from 'lodash';
import { App } from '../../../models/app.model';
import { TableSelectionService } from 'src/app/services/table-selection.service';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType, PlatformModalModel } from 'src/app/models/platform-modal.model';
import { NotificationType } from '../../../notifier/notificiation.model';
import { NotificationService } from '../../../notifier/notification.service';
import { AppsService } from 'src/app/services/apps.service';
import { RoleMappingModalComponent } from '../role-mapping-modal/role-mapping-modal.component';

@Component({
  selector: 'app-list-all-apps',
  templateUrl: './list-all-apps.component.html',
  styleUrls: ['./list-all-apps.component.scss'],
})
export class ListAllAppsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() vendors: any;
  @Input() displayedColumns: Array<string>;
  @Input() allItems: Array<App>;
  @Input() useNativeFilter: boolean;
  @Output() refresh: EventEmitter<any>;

  items: Array<App>;
  filteredItems: Array<App>;
  filters: any;
  viewMode: string;
  protected sortSub: Subscription;
  protected paginatorSub: Subscription;
  selectedItems: Object;
  selectedCount: number;
  selectionSub: Subscription;

  selection = {
    approved: [], // approved apps; native + third party
    pending: [], // pending apps; third party
    disabled: [], // disabled apps; third party
    active: [], // active apps; third party
    thirdParty: [], // third party apps
  };

  readonly menuOptions = [
    {
      display: 'Active',
      value: 'active',
    },
    {
      display: 'Disabled',
      value: 'disabled',
    },
    {
      display: 'Pending',
      value: 'pending',
    },
    {
      display: 'Native',
      value: 'native',
    },
    {
      display: 'Third Party',
      value: 'thirdparty',
    },
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private appSvc: AppsService,
    private dialog: MatDialog,
    private notificationsSvc: NotificationService,
    private selectionSvc: TableSelectionService
  ) {
    this.displayedColumns = [
      'selection',
      'appTitle',
      'version',
      'widgets',
      'clientName',
      'vendor',
      'status',
      'actions',
    ];
    this.filters = {
      appTitle: '',
      selected: [],
    };
    this.allItems = [];
    this.filteredItems = [];
    this.useNativeFilter = false;
    this.refresh = new EventEmitter();
    this.selectedItems = {};
    this.selectionSvc.setCompareField('docId');
    this.selectionSvc.resetSelection();
  }

  ngOnInit() {
    this.subscribeToPaging();
    this.subscribeToSort();
    this.selectionSub = this.selectionSvc.selection.subscribe((selected) => {
      this.selectedItems = selected;
      this.selectedCount = this.selectionSvc.getSelectedCount();

      const selectedApps = this.selectionSvc.getSelectedItems();
      this.selection.approved = selectedApps.filter((app: App) => app.approved || app.native);
      this.selection.pending = selectedApps.filter((app: App) => !app.approved && !app.native);
      this.selection.disabled = selectedApps.filter(
        (app: App) => !app.native && app.approved && !app.enabled
      );
      this.selection.active = selectedApps.filter(
        (app: App) => !app.native && app.approved && app.enabled
      );
      this.selection.thirdParty = selectedApps.filter((app: App) => !app.native);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.allItems.currentValue) {
      this.allItems = changes.allItems.currentValue;
      this.filterItems();
      this.sortItems();
      this.paginateItems();
    }
  }

  ngOnDestroy() {
    this.sortSub.unsubscribe();
    this.paginatorSub.unsubscribe();
    this.selectionSub.unsubscribe();
  }

  search(searchString: string) {
    this.filters.appTitle = searchString.toLowerCase();
    this.refreshItems(true);
  }

  viewModeChange(mode: string): void {
    this.viewMode = mode;
  }

  refreshItems(resetPage = false) {
    this.filterItems();
    this.sortItems();

    if (resetPage) {
      this.paginator.pageIndex = 0;
    }
    this.paginateItems();
  }

  get totalApps() {
    const str = `${this.paginator.length} Total Microapp`;
    return this.paginator.length > 1 ? str + 's' : str;
  }

  assignRolesToSelectedApps() {
    const roleMapDialogRef = this.dialog.open(RoleMappingModalComponent);
    roleMapDialogRef.afterClosed().subscribe((data) => {
      this.displayConfirmModal(
        {
          title: 'Assign roles',
          subtitle: `Are you sure you want to assign roles to following microapps?`,
          submitButtonTitle: 'Assign',
          submitButtonClass: 'bg-blue',
          formFields: [
            {
              type: 'static',
              label: 'Selected roles',
              defaultValue: data.map((role) => role.name),
              fullWidth: true,
            },
          ],
        },
        this.selection.approved,
        () => {
          const observables = this.selection.approved.map((app: App) => {
            const roles = _.union(
              app.roles,
              data.map((role) => role.id)
            );

            return this.appSvc.update({ ...app, roles }).pipe(
              map((updated: App) => {
                this.appSvc.appUpdated(updated);
                app.roles = roles;
                this.selectionSvc.toggleItem(app);
                return updated;
              }),
              catchError((err) => of(err))
            );
          });

          this.callAPIsSequence(observables).subscribe(({ success, failed }) => {
            let message = `${this.pluralize(data.length, 'role')} were assigned to ${this.pluralize(
              success
            )} successfully`;
            if (failed > 0) {
              message += ` but ${this.pluralize(failed)} failed`;
            }

            this.notificationsSvc.notify({
              type: NotificationType.INFO,
              message,
            });

            this.refreshItems();
          });
        }
      );
    });
  }

  enableSelectedApps() {
    const clientApps: any = {};

    this.selection.disabled.forEach((app: App) => {
      if (!clientApps[app.clientId]) {
        clientApps[app.clientId] = app;
      } else if (this.compareVersions(clientApps[app.clientId].version, app.version) < 0) {
        clientApps[app.clientId] = app;
      }
    });

    const selectedApps: App[] = Object.values(clientApps);

    this.displayConfirmModal(
      {
        title: 'Enable microapps',
        subtitle: 'Are you sure you want to enable following microapps?',
        submitButtonTitle: 'Enable',
        submitButtonClass: 'bg-blue',
        formFields: [],
      },
      selectedApps,
      () => {
        const observables = selectedApps.map((app: App) =>
          this.appSvc.update({ ...app, enabled: true }).pipe(
            map((updated: App) => {
              this.appSvc.appUpdated(updated);
              app.enabled = true;
              this.selectionSvc.toggleItem(app);
              return updated;
            }),
            catchError((err) => of(err))
          )
        );

        this.callAPIsSequence(observables).subscribe(({ success, failed }) => {
          let message = `${this.pluralize(success)} enabled successfully`;
          if (failed > 0) {
            message += ` but ${this.pluralize(failed)} failed`;
          }

          this.notificationsSvc.notify({
            type: NotificationType.INFO,
            message,
          });

          this.refreshItems();
          this.selectionSvc.resetSelection();
        });
      }
    );
  }

  disableSelectedApps() {
    this.displayConfirmModal(
      {
        title: 'Disable microapps',
        subtitle: 'Are you sure you want to disable following microapps?',
        submitButtonTitle: 'Disable',
        submitButtonClass: 'bg-red',
        formFields: [],
      },
      this.selection.active,
      () => {
        const observables = this.selection.active.map((app: App) =>
          this.appSvc.update({ ...app, enabled: false }).pipe(
            map((updated: App) => {
              this.appSvc.appUpdated(updated);
              app.enabled = false;
              this.selectionSvc.toggleItem(app);
              return updated;
            }),
            catchError((err) => of(err))
          )
        );

        this.callAPIsSequence(observables).subscribe(({ success, failed }) => {
          let message = `${this.pluralize(success)} disabled successfully`;
          if (failed > 0) {
            message += ` but ${this.pluralize(failed)} failed`;
          }

          this.notificationsSvc.notify({
            type: NotificationType.INFO,
            message,
          });

          this.refreshItems();
        });
      }
    );
  }

  approveSelectedApps() {
    this.displayConfirmModal(
      {
        title: 'Approve microapps',
        subtitle: 'Are you sure you want to approve following microapps?',
        submitButtonTitle: 'Approve',
        submitButtonClass: 'bg-blue',
        formFields: [],
      },
      this.selection.pending,
      () => {
        const observables = this.selection.pending.map((app: App) =>
          this.appSvc.update({ ...app, approved: true }).pipe(
            map((updated: App) => {
              this.appSvc.appUpdated(updated);
              app.approved = true;
              this.selectionSvc.toggleItem(app);
              return updated;
            }),
            catchError((err) => of(err))
          )
        );

        this.callAPIsSequence(observables).subscribe(({ success, failed }) => {
          let message = `${this.pluralize(success)} approved successfully`;
          if (failed > 0) {
            message += ` but ${this.pluralize(failed)} failed`;
          }

          this.notificationsSvc.notify({
            type: NotificationType.INFO,
            message,
          });

          this.refreshItems();
        });
      }
    );
  }

  deleteSelectedApps() {
    this.displayConfirmModal(
      {
        title: 'Delete microapps',
        subtitle: 'Are you sure you want to delete following microapps?',
        submitButtonTitle: 'Delete',
        submitButtonClass: 'bg-red',
        formFields: [],
      },
      this.selection.thirdParty,
      () => {
        const observables = this.selection.thirdParty.map((app: App) =>
          this.appSvc.delete(app.docId).pipe(
            map((response) => {
              this.allItems = this.allItems.filter((item) => item.docId !== app.docId);
              this.selectionSvc.toggleItem(app);
              this.filterItems();
              this.sortItems();
              this.paginateItems();
              return response;
            }),
            catchError((err) => of(err))
          )
        );

        this.callAPIsSequence(observables).subscribe(({ success, failed }) => {
          let message = `${this.pluralize(success)} deleted successfully`;
          if (failed > 0) {
            message += ` but ${this.pluralize(failed)} failed`;
          }

          this.notificationsSvc.notify({
            type: NotificationType.INFO,
            message,
          });
        });
      }
    );
  }

  updateMenuFilter(menus: string[]) {
    this.filters.selected = menus;
    this.refreshItems(true);
  }

  isAllSelected() {
    let result = true;
    this.items.forEach((item) => {
      result = this.selectedItems[item.docId] && result;
    });
    return result;
  }

  toggleAllSelection() {
    const selected = this.isAllSelected();
    this.selectionSvc.selectBatch(this.items, !selected);
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
    const statusFilter = (app: App) =>
      (!selected.active && !selected.disabled && !selected.pending) ||
      (selected.active && (app.approved || app.native) && app.enabled) ||
      (selected.disabled && (app.approved || app.native) && !app.enabled) ||
      (selected.pending && !app.approved && !app.native);

    const typeFilter = (app: App) =>
      (!selected.native && !selected.thirdparty) ||
      (selected.native && app.native) ||
      (selected.thirdparty && !app.native);

    this.filteredItems = this.allItems.filter(
      (app) => titleFilter(app) && statusFilter(app) && typeFilter(app)
    );
    this.paginator.length = this.filteredItems.length;
  }

  private paginateItems() {
    this.items = this.filteredItems.slice(
      this.paginator.pageIndex * this.paginator.pageSize,
      (this.paginator.pageIndex + 1) * this.paginator.pageSize
    );
  }

  private sortItems() {
    this.filteredItems.sort((a: App, b: App) => {
      let valA: string;
      let valB: string;
      if (['appTitle', 'clientName'].indexOf(this.sort.active) >= 0) {
        valA = a[this.sort.active] || '';
        valB = b[this.sort.active] || '';
      } else if (this.sort.active === 'status') {
        valA = this.getStatus(a);
        valB = this.getStatus(b);
      } else if (this.sort.active === 'vendor') {
        valA = this.vendors[a.vendorId] || '';
        valB = this.vendors[b.vendorId] || '';
      }

      return this.sort.direction === 'asc' ? valA.localeCompare(valB) : -valA.localeCompare(valB);
    });
  }

  private getStatus(app: App): string {
    if ((app.approved || app.native) && app.enabled) {
      return 'active';
    } else if ((app.approved || app.native) && !app.enabled) {
      return 'disabled';
    } else {
      return 'pending';
    }
  }

  private pluralize(count, word = 'application') {
    return `${count} ${word}${count > 1 ? 's' : ''}`;
  }

  private displayConfirmModal(config: PlatformModalModel, apps: App[], callback: () => void) {
    config.type = PlatformModalType.SECONDARY;
    let fieldValue = apps
      .slice(0, 5)
      .map((app: App) => (app.native ? app.appTitle : `${app.appTitle}(${app.version})`))
      .join(', ');
    if (apps.length > 5) {
      fieldValue += ` and +${this.pluralize(apps.length - 5)}`;
    }
    config.formFields.push({
      type: 'static',
      label: 'Selected applications',
      defaultValue: fieldValue,
      fullWidth: true,
    });

    const modalRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(
      PlatformModalComponent,
      { data: config }
    );

    modalRef.afterClosed().subscribe((data) => {
      if (data) {
        callback();
      }
    });
  }

  private compareVersions(v1, v2) {
    const formatVersion = (v) => {
      v = v.match(/\d+(\.\d+)*/);
      return v ? v[0].split('.') : [0];
    };

    v1 = formatVersion(v1 || '');
    v2 = formatVersion(v2 || '');
    const c = Math.max(v1.length, v2.length);

    for (let i = 0; i < c; i++) {
      const v1_i = +v1[i] || 0;
      const v2_i = +v2[i] || 0;

      if (v1_i < v2_i) {
        return -1;
      } else if (v1_i > v2_i) {
        return 1;
      }
    }

    return 0;
  }

  private callAPIsSequence(observables) {
    return concat(...observables).pipe(
      toArray(),
      map((result: any[]) => {
        let failed = 0;
        result.forEach((response: any) => {
          if (response instanceof Error) {
            failed++;
          }
        });

        return {
          failed,
          success: result.length - failed,
          responses: result,
        };
      })
    );
  }
}
