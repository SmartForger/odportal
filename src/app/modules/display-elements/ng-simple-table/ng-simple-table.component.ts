import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  SimpleTableColumn,
  SimpleTableActionEvent,
  SimpleTableRow,
  SimpleTableCellData
} from "src/app/models/simple-table-column.model";

@Component({
  selector: "ng-simple-table",
  templateUrl: "./ng-simple-table.component.html",
  styleUrls: ["./ng-simple-table.component.scss"]
})
export class NgSimpleTableComponent implements OnInit {
  @Input() tableTitle: string;
  @Input() columns: SimpleTableColumn[];
  @Input() data: SimpleTableRow[];
  @Output() actionClick: EventEmitter<SimpleTableActionEvent>;
  @Input() tableButtonLabel: string;
  @Output() tableButtonClick: EventEmitter<any>;

  private readonly circleColors = {
    red: "#CB1010",
    blue: "#0063BF",
    green: "#04B44B"
  };

  constructor() {
    this.columns = [];
    this.data = [];
    this.actionClick = new EventEmitter<SimpleTableActionEvent>();
    this.tableButtonClick = new EventEmitter<any>();
  }

  ngOnInit() {}

  handleAction(action, row) {
    this.actionClick.emit({
      action,
      row
    });
  }

  getCircleColor(row: SimpleTableRow, col: SimpleTableColumn): string {
    return (
      this.circleColors[
        (row[col.field] as SimpleTableCellData).color || col.color
      ] || "#000"
    );
  }
}
