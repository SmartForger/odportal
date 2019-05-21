import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { MatDialog, PageEvent } from "@angular/material";
import * as moment from "moment";
import _ from "lodash";

import { SessionTrackingServiceService } from "../../../services/session-tracking-service.service";
import { RealmEventsConfigRepresentation } from "../../../models/realm-events-config-representation";
import { EventRepresentation } from "../../../models/event-representation";
import { EventFilterParams } from "../../../models/event-filter-params";
import { DetailsDialogComponent } from "../../display-elements/details-dialog/details-dialog.component";

@Component({
  selector: "app-login-events",
  templateUrl: "./login-events.component.html",
  styleUrls: ["./login-events.component.scss"]
})
export class LoginEventsComponent implements OnInit, OnDestroy {
  displayedColumns = ["time", "client", "user", "action"];
  events: EventRepresentation[] = [];
  filteredEvents: EventRepresentation[] = [];
  pagedEvents: EventRepresentation[] = [];
  clients: string[] = [];
  users: string[] = [];
  subscriptions: Subscription[] = [];
  eventsEnabled = false;
  filter: EventFilterParams = {};
  page = 0;
  pageSize = 10;

  constructor(
    public sessionTrackingSvc: SessionTrackingServiceService,
    public dialog: MatDialog
  ) {
    this.subscriptions.push(
      this.sessionTrackingSvc.config.subscribe(
        (config: RealmEventsConfigRepresentation) => {
          this.eventsEnabled = config.eventsEnabled;
        }
      )
    );
    this.subscriptions.push(
      this.sessionTrackingSvc.events.subscribe(
        (events: EventRepresentation[]) => {
          this.events = events;
          this.clients = _.uniq(events.map(ev => ev.clientId));
          this.users = _.uniq(events.map(ev => ev.userId));
          this.filterEvents();
        }
      )
    );
  }

  ngOnInit() {
    this.sessionTrackingSvc.getEvents();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  openDetails(details: Object) {
    this.dialog.open(DetailsDialogComponent, {
      data: {
        details,
        title: "Details"
      }
    });
  }

  format(timestamp: number) {
    return moment(timestamp).format("MMM DD, YYYY hh:mm a");
  }

  filterEvents(filter?: EventFilterParams) {
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

  private _filter(ev: EventRepresentation, filter: EventFilterParams) {
    if (filter.dateFrom && +ev.time < filter.dateFrom.getTime()) {
      return false;
    }
    if (filter.dateTo && +ev.time >= filter.dateTo.getTime() + 86400000) {
      return false;
    }
    return ["clientId", "userId"].every(
      field => !filter[field] || ev[field] === filter[field]
    );
  }
}
