import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, Sort } from "@angular/material";
import { PlatformModalType } from "src/app/models/platform-modal.model";
import { TableSelectModalModel } from "src/app/models/table-select-modal.model";
import { DirectQueryList } from "src/app/base-classes/direct-query-list";
import { UserProfileKeycloak } from "src/app/models/user-profile.model";
import { Observable } from "rxjs";

@Component({
    selector: "app-table-select-modal",
    templateUrl: "./table-select-modal.component.html",
    styleUrls: ["./table-select-modal.component.scss"]
})
export class TableSelectModalComponent<T> extends DirectQueryList<T> implements OnInit {

    currentSort: Sort;
    filteredData: Array<T>;
    filteredSelectedData: Array<T>;
    selectedData: Array<T>;
    search: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: TableSelectModalModel<T>,
        private dlgRef: MatDialogRef<TableSelectModalComponent<T>>
    ) {
        super(data.columns);

        this.dlgRef.addPanelClass("platform-modal");
        this.dlgRef.addPanelClass(PlatformModalType.PRIMARY);

        this.currentSort = {
            active: data.columns[0],
            direction: "asc"
        };
        this.filteredData = new Array<T>();
        this.filteredSelectedData = new Array<T>();
        this.query = data.query;
        this.search = "";
        this.selectedData = new Array<T>();
    }

    ngOnInit(){
        super.ngOnInit();
    }

    filter(str) {
        if(str !== this.search){
            this.search = str.toLowerCase();
            this.page = 0;
        }
        this.filterItems();
    }

    filterItems() {
        let allFilteredData;
        this.filteredData = new Array<T>();
        this.filteredSelectedData = new Array<T>();

        if(!this.search){
            allFilteredData = this.items;
        }
        else{
            allFilteredData = this.data.filterFunc(this.search, this.data.data);
        }

        allFilteredData.forEach((data: T) => {
            let foundInSelected = this.selectedData.find((selectedValue) => {return data === selectedValue;});
            if(foundInSelected !== undefined){
                this.filteredSelectedData.push(data);
            }
            else{
                this.filteredData.push(data);
            }
        });

        this.sortChange();
        this.table.renderRows();
    }

    onLoadAll(): void{
        this.fetchAll();
    }

    select(row) {
        const i = this.selectedData.indexOf(row);
        if (i >= 0) {
            this.selectedData.splice(i, 1);
        } else {
            this.selectedData.push(row);
        }
        this.filterItems();
    }

    sortChange(sort?: Sort) {
        if (sort) {
            this.currentSort = sort;
        }

        const toString = val => (val ? "" + val : "");

        this.filteredSelectedData.sort((a: any, b: any) => {
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
        this.filteredItems = [...this.filteredSelectedData, ...this.filteredData];
        this.listDisplayItems();
    }

    submit() {
        this.dlgRef.close(this.selectedData);
    }
}
