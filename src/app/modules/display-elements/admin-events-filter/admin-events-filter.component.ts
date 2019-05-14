import { Component, Output, EventEmitter, Input } from "@angular/core";
import { AdminEventFilterParams } from "../../../models/admin-event-filter-params";

@Component({
  selector: "app-admin-events-filter",
  templateUrl: "./admin-events-filter.component.html",
  styleUrls: ["./admin-events-filter.component.scss"]
})
export class AdminEventsFilterComponent {
  @Input() operationTypes: string[] = [];
  @Input() resourcePaths: string[] = [];
  @Input() resourceTypes: string[] = [];
  @Output() filterChange = new EventEmitter<AdminEventFilterParams>();
  filter: AdminEventFilterParams = {};

  constructor() {}

  updateDateFrom(date: Date) {
    this.filter.dateFrom = date;
    this.filterChange.emit(this.filter);
  }

  updateDateTo(date: Date) {
    this.filter.dateTo = date;
    this.filterChange.emit(this.filter);
  }

  updateOperationType(type: string) {
    this.filter.operationType = type;
    this.filterChange.emit(this.filter);
  }

  updateResourcePath(path: string) {
    this.filter.resourcePath = path;
    this.filterChange.emit(this.filter);
  }

  updateResourceType(type: string) {
    this.filter.resourceType = type;
    this.filterChange.emit(this.filter);
  }
}
