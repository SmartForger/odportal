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
import { App } from "../../../models/app.model";
import { Subscription, of, concat } from "rxjs";
import { TableSelectionService } from "src/app/services/table-selection.service";
import { PlatformModalComponent } from "../../display-elements/platform-modal/platform-modal.component";
import { PlatformModalType } from "src/app/models/platform-modal.model";
import { NotificationType } from '../../../notifier/notificiation.model';
import { NotificationService } from '../../../notifier/notification.service';
import { AppsService } from "src/app/services/apps.service";
import { map, catchError, toArray } from "rxjs/operators";

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

  enableSelectedApps() {

  }

  deleteSelectedApps() {
    let modalRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: "Delete microapps",
        subtitle: "Are you sure you want to delete all selected microapps?",
        submitButtonTitle: "Delete",
        submitButtonClass: "bg-red",
        formFields: [
          {
            type: "static",
            label: "Selected Count",
            defaultValue: this.selectedCount
          }
        ]
      }
    });

    modalRef.afterClosed().subscribe(data => {
      if(data){
        const observables = this.selectionSvc.getSelectedItems().map(
          (app: App) => this.appSvc.delete(app.docId)
            .pipe(
              map(response => response),
              catchError(err => of(new Error('error occured')))
            )
        );

        concat(...observables).pipe(toArray())
          .subscribe((result: any[]) => {
            let failed = 0;
            result.forEach((response: any) => {
              if (response instanceof Error) {
                failed ++;
              }
            });

            let message = `${this.pluralize(result.length - failed, true)} deleted successfully`;
            if (failed > 0) {
              message += ` but ${this.pluralize(failed)} failed`;
            }

            this.notificationsSvc.notify({
              type: NotificationType.INFO,
              message
            });

            this.removeDeletedItems(result);
          });
      }
    });
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

  protected removeDeletedItems(result: any[]): void {
    const apps: App[] = this.selectionSvc.getSelectedItems();
    const deletedAppIds = result.map((response, i) => response instanceof Error ? -1 : i)
      .filter(index => index >= 0)
      .map(index => apps[index].docId);
    this.allItems = this.allItems.filter(item => deletedAppIds.indexOf(item.docId) < 0);
    this.refreshItems();
    this.selectionSvc.resetSelection();
  }

  private pluralize(count, withSuffix = false) {
    return `${count} microapp${count > 1 ? 's' : ''} ${withSuffix ? count > 1 ? 'were' : 'was' : ''}`;
  }
}
