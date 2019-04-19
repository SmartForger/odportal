import {Subscription} from 'rxjs';
import {AfterViewInit, OnDestroy, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {ApiSearchCriteria} from '../models/api-search-criteria.model';

export abstract class SSPList<T> implements AfterViewInit, OnDestroy {

    items: Array<T>;
    displayedColumns: Array<string>;
    searchCriteria: ApiSearchCriteria;
    protected sortSub: Subscription;
    protected paginatorSub: Subscription;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(displayedColumns: Array<string>, searchCriteria: ApiSearchCriteria) {
        this.items = new Array<T>();
        this.displayedColumns = displayedColumns;
        this.searchCriteria = searchCriteria;
    }

    ngAfterViewInit() {
        this.subscribeToSort();
        this.subscribeToPaging();
    }

    ngOnDestroy() {
        if (this.sortSub) {
            this.sortSub.unsubscribe();
        }
        if (this.paginatorSub) {
            this.paginatorSub.unsubscribe();
        }
    }

    protected abstract listItems(): void;

    applyFilter(key: string, value: string): void {
        this.paginator.pageIndex = 0;
        this.searchCriteria.pageIndex = 0;
        this.searchCriteria.filters[key] = value;
        this.listItems();
    }

    protected subscribeToSort(): void {
        this.sortSub = this.sort.sortChange.subscribe(() => {
            this.paginator.pageIndex = 0;
            this.searchCriteria.pageIndex = 0;
            this.searchCriteria.sortColumn = this.sort.active;
            this.searchCriteria.sortOrder = this.sort.direction;
            this.listItems();
        });
    }

    protected subscribeToPaging(): void { 
        this.paginatorSub = this.paginator.page.subscribe(() => {
            this.searchCriteria.pageIndex = this.paginator.pageIndex;
            this.listItems();
        });
    }

}