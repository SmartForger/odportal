/**
 * @description Displays information about widgets that belong to the app
 * @author Steven M. Redman
 */

import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { App } from "../../../models/app.model";
import { Widget } from "../../../models/widget.model";

@Component({
  selector: "app-widgets",
  templateUrl: "./widgets.component.html",
  styleUrls: ["./widgets.component.scss"],
})
export class WidgetsComponent implements OnInit {
  allItemsFetched: boolean;
  widgets: Widget[];
  filteredItems: Widget[];
  page: number;
  pageSize: number;

  protected sortSub: Subscription;
  protected paginatorSub: Subscription;

  @Input() app: App;
  @Input() displayedColumns: Array<string>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() {
    this.page = 0;
    this.pageSize = 10;
    this.displayedColumns = ["widgetTitle", "widgetTag", "widgetBootstrap"];
  }

  ngOnInit() {
    this.widgets = this.app.widgets;
    this.allItemsFetched = true;
    this.subscribeToSort();
    this.subscribeToPaging();
    this.search("");
  }

  search(searchString: string) {
    this.widgets = this.app.widgets.filter(
      (w) =>
        w.widgetTitle.toLowerCase().indexOf(searchString.toLowerCase()) >= 0
    );
    this.paginator.length = this.widgets.length;
    this.listDisplayItems();
  }

  get totalWidgets() {
    let str = this.paginator.length + " Total Widget";
    return this.paginator.length > 1 ? str + "s" : str;
  }

  paginatorLength(): number {
    return this.filteredItems.length + (this.allItemsFetched ? 0 : 1);
  }

  ngOnDestroy() {
    if (this.paginatorSub) {
      this.paginatorSub.unsubscribe();
    }
  }

  protected listDisplayItems(): void {
    const startIndex = this.page * this.pageSize;
    this.filteredItems = this.widgets.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  private sortItems() {
    this.widgets.sort((a: Widget, b: Widget) => {
      const valA: string = a[this.sort.active] || "";
      const valB: string = b[this.sort.active] || "";
      return this.sort.direction === "asc"
        ? valA.localeCompare(valB)
        : -valA.localeCompare(valB);
    });
  }

  protected subscribeToPaging(): void {
    this.paginatorSub = this.paginator.page.subscribe(() => {
      this.pageSize = this.paginator.pageSize;
      this.page = this.paginator.pageIndex;
      this.listDisplayItems();
    });
  }

  protected subscribeToSort(): void {
    this.sortSub = this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.sortItems();
      this.listDisplayItems();
    });
  }
}
