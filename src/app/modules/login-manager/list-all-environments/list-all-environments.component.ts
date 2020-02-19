import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { of } from 'rxjs';

import { DirectQueryList } from 'src/app/base-classes/direct-query-list';

@Component({
  selector: 'app-list-all-environments',
  templateUrl: './list-all-environments.component.html',
  styleUrls: ['./list-all-environments.component.scss']
})
export class ListAllEnvironmentsComponent extends DirectQueryList<any> {

  @Input() allItems = [];

  constructor() {
    super(new Array<string>("environment", "classification", "owner", "support", "sessions", "status", "actions"));
    this.query = function(first: number, max: number){return of(this.allItems.slice(first, max));}.bind(this);
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.allItems && changes.allItems.currentValue.length > 0) {
      this.fetchItems(0, this.MAX_RESULTS).subscribe(() => {
        this.listDisplayItems();
      });
    }
  }

  get totalEnvironments() {
    let str = `${this.paginator.length} Total Environments`;
    return this.paginator.length > 1 ? str + 's' : str;
  }

  protected filterItems(): void {
    let col = this.sortColumn;
    if(this.sortColumn === '') {
      col = 'environment';
    } else if (this.sortColumn === 'sessions') {
      col = 'activeSessions';
    }

    this.filteredItems.sort((a, b) => {
      const sortOrder = this.sort.direction === 'desc' ? -1 : 1;
      return a[col] < b[col] ? -1 * sortOrder : sortOrder;
    });
  }

}
