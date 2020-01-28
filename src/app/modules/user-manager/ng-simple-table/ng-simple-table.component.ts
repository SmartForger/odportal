import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SimpleTableColumn, SimpleTableActionEvent } from 'src/app/models/simple-table-column.model';

@Component({
  selector: 'ng-simple-table',
  templateUrl: './ng-simple-table.component.html',
  styleUrls: ['./ng-simple-table.component.scss']
})
export class NgSimpleTableComponent implements OnInit {
  @Input() tableTitle: string;
  @Input() columns: SimpleTableColumn[];
  @Input() data: any[];
  @Output() actionClick: EventEmitter<SimpleTableActionEvent>;
  @Input() tableButtonLabel: string;
  @Output() tableButtonClick: EventEmitter<any>;

  constructor() {
    this.columns = [];
    this.data = [];
    this.actionClick = new EventEmitter<SimpleTableActionEvent>();
    this.tableButtonClick = new EventEmitter<any>();
  }

  ngOnInit() {
  }

  handleAction(action, row) {
    this.actionClick.emit({
      action,
      row
    });
  }
}
