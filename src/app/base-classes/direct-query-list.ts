import {Subscription, Observable, Subscribable} from 'rxjs';
import {AfterViewInit, OnDestroy, ViewChild, Input, OnInit} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { MatTable } from '@angular/material';

export abstract class DirectQueryList<T> implements OnInit, AfterViewInit, OnDestroy {

    allItemsFetched: boolean;
    displayedColumns: Array<string>;
    displayItems: Array<T>;
    filteredItems: Array<T>;
    items: Array<T>;
    page: number;
    pageSize: number;
    query: (first: number, max: number) => Observable<Array<T>>;
    sortColumn: string;
    sortOrder: string;
    protected sortSub: Subscription;
    protected paginatorSub: Subscription;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<T>;

    readonly MAX_RESULTS: number = 1000;
    
    constructor(displayedColumns: Array<string>) {
        this.allItemsFetched = false;
        this.displayedColumns = displayedColumns;
        this.displayItems = new Array<T>();
        this.filteredItems = new Array<T>();
        this.items = new Array<T>();
        this.page = 0;
        this.pageSize = 10;
        this.sortColumn = '';
    }

    ngOnInit() {
        this.fetchItems(0, this.MAX_RESULTS).subscribe(() => {
            this.listDisplayItems();
        });
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

    displayCount(): string{
        return  `${(this.page * this.pageSize) + 1} - ${Math.min(this.filteredItems.length, (this.page * this.pageSize) + this.pageSize)}${this.allItemsFetched ? ` of ${this.filteredItems.length}` : ''}`;
    }

    fetchAll(first: number = this.items.length): void{
        if(!this.allItemsFetched){
            this.fetchItems(first, this.MAX_RESULTS).subscribe(() => {
                this.fetchAll(first + this.MAX_RESULTS);
            });
        }
    }

    paginatorLength(): number {
        return this.filteredItems.length + (this.allItemsFetched ? 0 : 1);
    }
    
    refresh(): void{
        this.allItemsFetched = false;
        this.displayItems = new Array<T>();
        this.filteredItems = new Array<T>();
        this.items = new Array<T>();
        this.page = 0;
        this.sortColumn = '';

        this.fetchItems(0, this.MAX_RESULTS).subscribe(() => {
            this.listDisplayItems();
        });
    }

    protected fetchItems(first: number, max: number): Observable<void>{
        return new Observable<void>(observer => {
            this.query(first, max).subscribe(
                (results: Array<T>) => {
                    this.items = this.items.concat(results);
                    this.filteredItems = [].concat(this.items);
                    this.allItemsFetched = results.length < max;
                    if(this.allItemsFetched){
                        this.filterItems();
                        this.sort.disabled = false;
                        this.table.renderRows();
                    }
                    observer.next();
                    observer.complete();
                },
                (err: any) => {
                    console.log(err);
                    observer.error(err);
                    observer.complete();
                }
            );
        });
    }

    protected abstract filterItems(): void;

    protected listDisplayItems(): void{
        const startIndex = this.page * this.pageSize;
        this.displayItems = this.filteredItems.slice(startIndex, startIndex + this.pageSize);
    };

    protected subscribeToSort(): void {
        this.sortSub = this.sort.sortChange.subscribe(() => {
            this.page = 0;
            this.sortColumn = this.sort.active;
            this.sortOrder = this.sort.direction;
            this.filterItems();
            this.listDisplayItems();
        });
        this.sort.disabled = !this.allItemsFetched;
        this.sort.start = 'asc';
    }

    protected subscribeToPaging(): void { 
        this.paginatorSub = this.paginator.page.subscribe(() => {
            this.pageSize = this.paginator.pageSize;
            let first = this.paginator.pageIndex * this.pageSize;
            let last = first + this.pageSize;
            if(!this.allItemsFetched && this.filteredItems.length <= last){
                this.fetchItems(first, Math.min(last - this.filteredItems.length, this.pageSize)).subscribe(() => {
                    this.page = this.paginator.pageIndex;
                    this.listDisplayItems();
                });
            }
            else{
              this.page = this.paginator.pageIndex;
              this.listDisplayItems();
            }
        });
    }

}