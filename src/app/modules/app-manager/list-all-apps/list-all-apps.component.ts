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
import { MatSort, MatPaginator } from "@angular/material";
import { App } from "../../../models/app.model";
import { Subscription } from "rxjs";
import { KeyValue } from "src/app/models/key-value.model";

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

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() {
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
      active: false,
      disabled: false,
      pending: false,
      native: false,
      thirdparty: false
    };
    this.allItems = [];
    this.filteredItems = [];
    this.useNativeFilter = false;
    this.refresh = new EventEmitter();
  }

  ngOnInit() {
    this.subscribeToPaging();
    this.subscribeToSort();
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
    const statusFilter = (app: App) =>
      (!this.filters.active && !this.filters.disabled && !this.filters.pending) ||
      (this.filters.active && (app.approved || app.native) && app.enabled) ||
      (this.filters.disabled && (app.approved || app.native) && !app.enabled) ||
      (this.filters.pending && !app.approved && !app.native);

    const typeFilter = (app: App) =>
      (!this.filters.native && !this.filters.thirdparty) ||
      (this.filters.native && app.native) ||
      (this.filters.thirdparty && !app.native);

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
}
