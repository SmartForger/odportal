import { Component, OnInit } from "@angular/core";
import { mergeMap, switchMap, map } from "rxjs/operators";
import { forkJoin } from "rxjs";
import _ from "lodash";

import { SessionTrackingServiceService } from "../../../services/session-tracking-service.service";
import { ClientSessionState } from "../../../models/client-session-state";
import { UserSession } from "../../../models/user-session";
import { FilterOption } from "../../../models/filter-option";

@Component({
  selector: "app-active-sessions",
  templateUrl: "./active-sessions.component.html",
  styleUrls: ["./active-sessions.component.scss"]
})
export class ActiveSessionsComponent implements OnInit {
  // Data
  clientSessionStats: ClientSessionState[] = [];
  userSessions: UserSession[] = [];

  // Filter options
  ipAddresses: string[] = [];
  clients: FilterOption[] = [];
  users: FilterOption[] = [];

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
      });
  }
}
