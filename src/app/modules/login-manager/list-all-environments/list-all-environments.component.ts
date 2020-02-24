import { Component, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { of } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { DirectQueryList } from 'src/app/base-classes/direct-query-list';
import { CreateEnvConfigComponent } from '../create-env-config/create-env-config.component';

@Component({
  selector: 'app-list-all-environments',
  templateUrl: './list-all-environments.component.html',
  styleUrls: ['./list-all-environments.component.scss']
})
export class ListAllEnvironmentsComponent extends DirectQueryList<any> {

  @Input() allItems = [];

  @Output() add: EventEmitter<any>;

  constructor(private dialog: MatDialog) {
    super(new Array<string>("environment", "classification", "owner", "support", "sessions", "status", "actions"));
    this.query = function(first: number, max: number){return of(this.allItems.slice(first, max));}.bind(this);
    this.add = new EventEmitter<any>();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.allItems && changes.allItems.currentValue.length > 0) {
      this.fetchItems(0, this.MAX_RESULTS).subscribe(() => {
        this.listDisplayItems();
      });
    }
  }

  create() {
    let modalRef: MatDialogRef<CreateEnvConfigComponent> = this.dialog.open(CreateEnvConfigComponent);
    modalRef.afterClosed().subscribe(data => {
      if (data) {
        const newConfig = {
          ...data,
          docId: uuid(),
          owner: 'Test Owner',
          support: 'support@test.com',
          activeSessions: Math.floor(Math.random()*100) + 11,
          status: Math.random() > 0.5 ? 'online' : 'offline'
        };

        this.add.emit(newConfig);
      }
    });
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
