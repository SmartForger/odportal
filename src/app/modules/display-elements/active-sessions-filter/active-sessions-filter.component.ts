import { Component, Output, EventEmitter, Input, ChangeDetectorRef } from "@angular/core";
import { ActiveSessionsFilterParams } from "src/app/models/active-sessions-filter-params";

@Component({
  selector: "app-active-sessions-filter",
  templateUrl: "./active-sessions-filter.component.html",
  styleUrls: ["./active-sessions-filter.component.scss"]
})
export class ActiveSessionsFilterComponent {
  @Input() clients: string[] = [];
  @Input() users: string[] = [];
  @Input() ipAddresses: string[] = [];
  @Output() filterChange = new EventEmitter<ActiveSessionsFilterParams>();
  filter: ActiveSessionsFilterParams = {};

  constructor(private cdr: ChangeDetectorRef) {}

  update(field: string, value: any) {
    this.filter[field] = value;
    this.filterChange.emit(this.filter);
    this.cdr.detectChanges();
  }
}
