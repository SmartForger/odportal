import {
  Component,
  OnChanges,
  OnInit,
  OnDestroy,
  Input,
  SimpleChanges,
  ViewChild,
  Output,
  EventEmitter
} from "@angular/core";
import { MatSort, MatPaginator, MatDialogRef, MatDialog } from "@angular/material";
import { Subscription, of, concat } from "rxjs";
import { map, catchError, toArray } from "rxjs/operators";
import _ from 'lodash';
import { App } from "../../../models/app.model";
import { TableSelectionService } from "src/app/services/table-selection.service";
import { PlatformModalComponent } from "../../display-elements/platform-modal/platform-modal.component";
import { PlatformModalType, PlatformModalModel } from "src/app/models/platform-modal.model";
import { NotificationType } from '../../../notifier/notificiation.model';
import { NotificationService } from '../../../notifier/notification.service';
import { AppsService } from "src/app/services/apps.service";

@Component({
  selector: "app-list-all-apps",
  templateUrl: "./list-all-apps.component.html",
  styleUrls: ["./list-all-apps.component.scss"]
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
    thirdParty: [] // third party apps
  }

  readonly menuOptions = [
    {
      display: 'Active',
      value: 'active'
    },
    {
      display: 'Disabled',
      value: 'disabled'
    },
    {
      display: 'Pending',
      value: 'pending'
    },
    {
      display: 'Native',
      value: 'native'
    },
    {
      display: 'Third Party',
      value: 'thirdparty'
    }
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
      "appTitle",
      "version",
      "widgets",
      "clientName",
      "vendor",
      "status",
      "actions"
    ];
    this.filters = {
      appTitle: "",
      selected: []
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
    this.selectionSub = this.selectionSvc.selection.subscribe(selected => {
      this.selectedItems = selected;
      this.selectedCount = this.selectionSvc.getSelectedCount();

      const selectedApps = this.selectionSvc.getSelectedItems();
      this.selection.approved = selectedApps.filter((app: App) => app.approved || app.native);
      this.selection.pending = selectedApps.filter((app: App) => !app.approved && !app.native);
      this.selection.disabled = selectedApps.filter((app: App) => !app.native && app.approved && !app.enabled);
      this.selection.active = selectedApps.filter((app: App) => !app.native && app.approved && app.enabled);
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
    this.refreshItems();
  }

  viewModeChange(mode: string): void {
    this.viewMode = mode;
  }

  refreshItems() {
    this.filterItems();
    this.sortItems();

    this.paginator.pageIndex = 0;
    this.paginateItems();
  }

  get totalApps() {
    let str = `${this.paginator.length} Total Microapp`;
    return this.paginator.length > 1 ? str + 's' : str;
  }

  assignRolesToSelectedApps() {
    
  }

  enableSelectedApps() {
    let clientApps: any = {};

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
        formFields: []
      },
      selectedApps,
      () => {
        const observables = selectedApps.map(
          (app: App) => this.appSvc.update({ ...app, enabled: true })
            .pipe(
              map((updated: App) => {
                this.appSvc.appUpdated(updated);
                app.enabled = true;
                return updated;
              }),
              catchError(err => of(err))
            )
        );

        this.callAPIsSequence(observables)
          .subscribe(({ success, failed }) => {
            let message = `${this.pluralize(success)} enabled successfully`;
            if (failed > 0) {
              message += ` but ${this.pluralize(failed)} failed`;
            }

            this.notificationsSvc.notify({
              type: NotificationType.INFO,
              message
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
        formFields: []
      },
      this.selection.active,
      () => {
        const observables = this.selection.active.map(
          (app: App) => this.appSvc.update({ ...app, enabled: false })
            .pipe(
              map((updated: App) => {
                this.appSvc.appUpdated(updated);
                app.enabled = false;
                return updated;
              }),
              catchError(err => of(err))
            )
        );

        this.callAPIsSequence(observables)
          .subscribe(({ success, failed }) => {
            let message = `${this.pluralize(success)} disabled successfully`;
            if (failed > 0) {
              message += ` but ${this.pluralize(failed)} failed`;
            }

            this.notificationsSvc.notify({
              type: NotificationType.INFO,
              message
            });

            this.refreshItems();
            this.selectionSvc.resetSelection();
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
        formFields: []
      },
      this.selection.disabled,
      () => {
        console.log('approve apps');
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
        formFields: []
      },
      this.selection.thirdParty,
      () => {
        const observables = this.selection.thirdParty.map(
          (app: App) => this.appSvc.delete(app.docId)
            .pipe(
              map(response => response),
              catchError(err => of(err))
            )
        );

        this.callAPIsSequence(observables)
          .subscribe(({ success, failed, responses }) => {
            let message = `${this.pluralize(success)} deleted successfully`;
            if (failed > 0) {
              message += ` but ${this.pluralize(failed)} failed`;
            }

            this.notificationsSvc.notify({
              type: NotificationType.INFO,
              message
            });

            const deletedAppIds = responses.map((response, i) => response instanceof Error ? -1 : i)
              .filter(index => index >= 0)
              .map(index => this.selection.thirdParty[index].docId);
            this.allItems = this.allItems.filter(item => deletedAppIds.indexOf(item.docId) < 0);
            this.refreshItems();
            this.selectionSvc.resetSelection();
          });
      }
    );
  }

  updateMenuFilter(menus: string[]) {
    this.filters.selected = menus;
    this.refreshItems();
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
    const selected = this.filters.selected.reduce((obj, item) => ({
      ...obj,
      [item]: true
    }), {})
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
      app => titleFilter(app) && statusFilter(app) && typeFilter(app)
    );
    this.paginator.length = this.filteredItems.length;
  }

  private paginateItems() {
    console.log('paginate items', this.paginator.pageIndex, this.paginator.pageSize);
    this.items = this.filteredItems.slice(
      this.paginator.pageIndex * this.paginator.pageSize,
      (this.paginator.pageIndex + 1) * this.paginator.pageSize
    );
  }

  private sortItems() {
    this.filteredItems.sort((a: App, b: App) => {
      let valA: string;
      let valB: string;
      if (["appTitle", "clientName"].indexOf(this.sort.active) >= 0) {
        valA = a[this.sort.active] || "";
        valB = b[this.sort.active] || "";
      } else if (this.sort.active === "status") {
        valA = this.getStatus(a);
        valB = this.getStatus(b);
      } else if (this.sort.active === "vendor") {
        valA = this.vendors[a.vendorId] || "";
        valB = this.vendors[b.vendorId] || "";
      }

      return this.sort.direction === "asc"
        ? valA.localeCompare(valB)
        : - valA.localeCompare(valB);
    });
  }

  private getStatus(app: App): string {
    if (app.approved && app.enabled) {
      return "active";
    } else if (app.approved && !app.enabled) {
      return "disabled";
    } else {
      return "pending";
    }
  }

  private pluralize(count) {
    return `${count} applications${count > 1 ? 's' : ''}`;
  }

  private displayConfirmModal(config: PlatformModalModel, apps: App[], callback: () => void) {
    config.type = PlatformModalType.SECONDARY;
    let fieldValue = apps.slice(0, 5)
      .map((app: App) => app.native ? app.appTitle : `${app.appTitle}(${app.version})` )
      .join(', ');
    if (apps.length > 5) {
      fieldValue += ` and +${apps.length - 5} app${apps.length === 6 ? '' : 's'}`;
    }
    config.formFields.push(
      {
        type: "static",
        label: "Selected Applications",
        defaultValue: fieldValue,
        fullWidth: true
      }
    );

    let modalRef: MatDialogRef<PlatformModalComponent> =
      this.dialog.open(PlatformModalComponent, { data: config });

    modalRef.afterClosed().subscribe(data => {
      if(data){
        callback();
      }
    });
  }

  private compareVersions(v1, v2) {
    const formatVersion = v => {
      v = v.match(/\d+(\.\d+)*/)
      return v ? v[0].split('.') : [0]
    };

    v1 = formatVersion(v1 || "")
    v2 = formatVersion(v2 || "")
    const c = Math.max(v1.length, v2.length)

    for (let i = 0; i < c; i ++) {
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
            failed ++;
          }
        });

        return {
          failed,
          success: result.length - failed,
          responses: result
        };
      })
    );
  }

}
