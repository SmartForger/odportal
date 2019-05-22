import { Component, OnInit } from "@angular/core";
import { mergeMap, switchMap, map } from "rxjs/operators";
import { forkJoin } from "rxjs";
import _ from "lodash";

import { SessionTrackingServiceService } from "../../../services/session-tracking-service.service";
import { ClientSessionState } from "../../../models/client-session-state";
import { UserSession } from "../../../models/user-session";
import { FilterOption } from "../../../models/filter-option";
import { ActiveSessionsFilterParams } from "src/app/models/active-sessions-filter-params";

@Component({
  selector: "app-active-sessions",
  templateUrl: "./active-sessions.component.html",
  styleUrls: ["./active-sessions.component.scss"]
})
export class ActiveSessionsComponent implements OnInit {
  // Data
  clientSessionStats: ClientSessionState[] = [];
  userSessions: UserSession[] = [];
  filteredSessions: UserSession[] = [];

  // Filter options
  ipAddresses: string[] = [];
  clients: FilterOption[] = [];
  users: FilterOption[] = [];

  filter: ActiveSessionsFilterParams = {};

  // Tabl columns
  displayedColumns = ['client', 'user', 'ipAddress', 'start', 'lastAccess'];

  constructor(private sessionTrackingSvc: SessionTrackingServiceService) {}

  ngOnInit() {
    this.sessionTrackingSvc
      .getClientSessionStats()
      .pipe(
        mergeMap((stats: ClientSessionState[]) => {
          this.clientSessionStats = stats;
          this.clients = stats.map(st => ({
            label: st.clientId,
            value: st.id
          }));

          return forkJoin(
            stats.map(state =>
              this.sessionTrackingSvc.getUserSessionsForClient(state.clientId)
            )
          );
        })
      )
      .subscribe((userSessionsArr: UserSession[][]) => {
        this.userSessions = _.flatten(userSessionsArr);

        const ips = [];
        const users: FilterOption[] = [];
        this.userSessions.forEach(session => {
          if (ips.indexOf(session.ipAddress) < 0) {
            ips.push(session.ipAddress);
          }
          if (users.findIndex(u => u.value === session.userId) < 0) {
            users.push({
              label: session.username,
              value: session.userId
            });
          }
        });
        this.ipAddresses = ips;
        this.users = users;

        this.filterSessions();
      });
  }

  filterSessions(filter?: ActiveSessionsFilterParams) {
    if (filter) {
      this.filter = filter;
    }

    this.filteredSessions = this.userSessions.filter(ev =>
      this._filter(ev, this.filter)
    );
  }

  private _filter(session: UserSession, filter: ActiveSessionsFilterParams) {

    const checkTs = ts => {
      if (filter.dateFrom && ts < filter.dateFrom.getTime()) {
        return false;
      }
      if (filter.dateTo && ts >= filter.dateTo.getTime() + 86400000) {
        return false;
      }

      return true;
    }

    if (!checkTs(session.start) && !checkTs(session.lastAccess)) {
      return false;
    }

    return ["clientId", "userId", "ipAddress"].every(
      field => !filter[field] || session[field] === filter[field]
    );
  }
}
