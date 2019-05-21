import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialog, PageEvent } from "@angular/material";
import { Subscription } from "rxjs";
import * as moment from "moment";
import _ from "lodash";

import { SessionTrackingServiceService } from "../../../services/session-tracking-service.service";
import { AuthDetailsRepresentaion } from "../../../models/auth-details-representation";
import { RealmEventsConfigRepresentation } from "../../../models/realm-events-config-representation";
import { AdminEventFilterParams } from "../../../models/admin-event-filter-params";
import { AdminEventRepresentation } from "../../../models/admin-event-representation";
import { DetailsDialogComponent } from "../../display-elements/details-dialog/details-dialog.component";

@Component({
  selector: "app-admin-events",
  templateUrl: "./admin-events.component.html",
  styleUrls: ["./admin-events.component.scss"]
})
export class AdminEventsComponent implements OnInit, OnDestroy {
  displayedColumns = [
    "time",
    "operation",
    "resourceType",
    "resourcePath",
    "details"
  ];
  events: AdminEventRepresentation[] = [];
  filteredEvents: AdminEventRepresentation[] = [];
  pagedEvents: AdminEventRepresentation[] = [];
  operationTypes: string[] = [];
  resourceTypes: string[] = [];
  resourcePaths: string[] = [];
  subscriptions: Subscription[] = [];
  adminEventsEnabled = false;
  filter: AdminEventFilterParams = {};
  page = 0;
  pageSize = 10;

  constructor(
    public sessionTrackingSvc: SessionTrackingServiceService,
    public dialog: MatDialog
  ) {
    this.subscriptions.push(
      this.sessionTrackingSvc.config.subscribe(
        (config: RealmEventsConfigRepresentation) => {
          this.adminEventsEnabled = config.eventsEnabled;
        }
      )
    );
    this.subscriptions.push(
      this.sessionTrackingSvc.adminEvents.subscribe(
        (events: AdminEventRepresentation[]) => {
          this.events = events;
          this.operationTypes = _.uniq(events.map(ev => ev.operationType));
          this.resourceTypes = _.uniq(events.map(ev => ev.resourceType));
          this.resourcePaths = _.uniq(events.map(ev => ev.resourcePath));
          this.filterEvents();
        }
      )
    );
  }

  ngOnInit() {
    this.sessionTrackingSvc.getAdminEvents();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  openDetails(details: AuthDetailsRepresentaion) {
    this.dialog.open(DetailsDialogComponent, {
      data: {
        details,
        title: "Auth details"
      }
    });
  }

  format(timestamp: number) {
    return moment(timestamp).format("MMM DD, YYYY hh:mm a");
  }

  filterEvents(filter?: AdminEventFilterParams) {
    if (filter) {
      this.filter = filter;
    }
    this.filteredEvents = this.events.filter(ev =>
      this._filter(ev, this.filter)
    );
    this.page = 0;
    this.paginate();
  }

  paginate(ev?: PageEvent) {
    if (ev) {
      this.page = ev.pageIndex;
      this.pageSize = ev.pageSize;
    }

    const start = this.page * this.pageSize;
    this.pagedEvents = this.filteredEvents.slice(start, start + this.pageSize);
  }

  private _filter(
    ev: AdminEventRepresentation,
    filter: AdminEventFilterParams
  ) {
    if (filter.dateFrom && +ev.time < filter.dateFrom.getTime()) {
      return false;
    }
    if (filter.dateTo && +ev.time >= filter.dateTo.getTime() + 86400000) {
      return false;
    }
    return ["operationType", "resourcePath", "resourceType"].every(
      field => !filter[field] || ev[field] === filter[field]
    );
  }
}
