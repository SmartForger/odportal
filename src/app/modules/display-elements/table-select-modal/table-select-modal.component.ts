import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, Sort } from "@angular/material";
import { PlatformModalType } from "src/app/models/platform-modal.model";
import { TableSelectModalModel } from "src/app/models/table-select-modal.model";

@Component({
  selector: "app-table-select-modal",
  templateUrl: "./table-select-modal.component.html",
  styleUrls: ["./table-select-modal.component.scss"]
})
export class TableSelectModalComponent implements OnInit {
  tableData: any[];
  filteredData: any[];
  currentSort: Sort;
  selectedData: any[];
  search: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TableSelectModalModel,
    private dlgRef: MatDialogRef<TableSelectModalComponent>
  ) {
    this.dlgRef.addPanelClass("platform-modal");
    this.dlgRef.addPanelClass(PlatformModalType.PRIMARY);

    this.selectedData = [];
    this.filteredData = data.data;
    this.tableData = data.data;
    this.currentSort = {
      active: data.columns[0],
      direction: "asc"
    };
    this.search = "";
  }

  ngOnInit() {}

  filterItems(str) {
    this.search = str.toLowerCase();
    this.filter();
  }

  filter() {
    const filterFunc = item =>
      this.data.filterFunc(this.search, item) && this.selectedData.indexOf(item) < 0;
    this.filteredData = this.data.data.filter(filterFunc);
    this.sortChange();
  }

  sortChange(sort?: Sort) {
    if (sort) {
      this.currentSort = sort;
    }

    const toString = val => (val ? "" + val : "");

    this.filteredData.sort((a: any, b: any) => {
      let valA, valB;
      if (this.currentSort.active === "fullname") {
        valA = toString(a.firstName) + " " + toString(a.lastName);
        valB = toString(b.firstName) + " " + toString(b.lastName);
      } else if (["username"].indexOf(this.currentSort.active) >= 0) {
        valA = toString(a[this.currentSort.active]);
        valB = toString(b[this.currentSort.active]);
      }

      return this.currentSort.direction === "asc"
        ? valA.localeCompare(valB)
        : -valA.localeCompare(valB);
    });
    this.tableData = [...this.selectedData, ...this.filteredData];
  }

  select(row) {
    const i = this.selectedData.indexOf(row);
    if (i >= 0) {
      this.selectedData.splice(i, 1);
    } else {
      this.selectedData.push(row);
    }
    this.filter();
  }

  submit() {
    this.dlgRef.close(this.selectedData);
  }
}
