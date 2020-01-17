import { Component, OnInit, OnDestroy, Input, ViewChild } from "@angular/core";
import { MatSort, MatPaginator } from "@angular/material";
import { App } from "../../../models/app.model";
import { Vendor } from "../../../models/vendor.model";
import { SSPList } from "../../../base-classes/ssp-list";
import { forkJoin, Subscription } from "rxjs";
import { AppsService } from "../../../services/apps.service";
import _ from "lodash";

@Component({
  selector: "app-list-all-apps",
  templateUrl: "./list-all-apps.component.html",
  styleUrls: ["./list-all-apps.component.scss"]
})
export class ListAllAppsComponent implements OnInit, OnDestroy {
  @Input() vendors: any;

  displayedColumns: Array<string>;
  items: Array<App>;
  allItems: Array<App>;
  filteredItems: Array<App>;
  filters: any;
  protected sortSub: Subscription;
  protected paginatorSub: Subscription;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private appsSvc: AppsService) {
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
      pending: false
    };
    this.allItems = [];
    this.filteredItems = [];
  }

  ngOnInit() {
    this.subscribeToPaging();
    this.subscribeToSort();

    this.listApps();
  }

  ngOnDestroy() {
    this.sortSub.unsubscribe();
    this.paginatorSub.unsubscribe();
  }

  listApps(): void {
    this.appsSvc.listApps().subscribe(
      (apps: Array<App>) => {
        this.allItems = apps;
        this.filterItems();
        this.sortItems();
        this.paginateItems();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  search(searchString: string) {
    this.filters.appTitle = searchString.toLowerCase();
    this.refreshItems();
  }

  refreshItems() {
    this.filterItems();
    this.sortItems();

    this.paginator.pageIndex = 0;
    this.paginateItems();
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

    this.filteredItems = this.allItems.filter(
      app => titleFilter(app) && statusFilter(app)
    );
    this.paginator.length = this.filteredItems.length;
    console.log('filter items', this.filteredItems.length);
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
      if (["appTitle", "clientName", "vendor"].indexOf(this.sort.active) >= 0) {
        valA = a[this.sort.active];
        valB = b[this.sort.active];
      } else if (this.sort.active === "status") {
        valA = this.getStatus(a);
        valB = this.getStatus(b);
      }

      return valA.localeCompare(valB);
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
