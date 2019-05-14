import { Component, Input, Output, EventEmitter } from "@angular/core";
import { EventFilterParams } from "../../../models/event-filter-params";

@Component({
  selector: "app-login-events-filter",
  templateUrl: "./login-events-filter.component.html",
  styleUrls: ["./login-events-filter.component.scss"]
})
export class LoginEventsFilterComponent {
  @Input() showUserFilter: boolean = true;
  @Input() clients: string[] = [];
  @Input() users: string[] = [];
  @Output() filterChange = new EventEmitter<EventFilterParams>();

  filter: EventFilterParams = {};

  constructor() {}

  updateDateFrom(date: Date) {
    this.filter.dateFrom = date;
    this.filterChange.emit(this.filter);
  }

  updateDateTo(date: Date) {
    this.filter.dateTo = date;
    this.filterChange.emit(this.filter);
  }

  updateClient(client: string) {
    this.filter.clientId = client;
    this.filterChange.emit(this.filter);
  }

  updateUser(user: string) {
    this.filter.userId = user;
    this.filterChange.emit(this.filter);
  }
}
