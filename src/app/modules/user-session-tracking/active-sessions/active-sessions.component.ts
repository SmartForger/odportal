import { Component, OnInit } from "@angular/core";
import { mergeMap, switchMap, map } from "rxjs/operators";
import { forkJoin } from "rxjs";
import _ from "lodash";

import { SessionTrackingServiceService } from "../../../services/session-tracking-service.service";
import { ClientSessionState } from "../../../models/client-session-state";
import { UserSession } from "src/app/models/user-session";

@Component({
  selector: "app-active-sessions",
  templateUrl: "./active-sessions.component.html",
  styleUrls: ["./active-sessions.component.scss"]
})
export class ActiveSessionsComponent implements OnInit {
  clientSessionStats: ClientSessionState[] = [];
  userSessions: UserSession[] = [];

  constructor(private sessionTrackingSvc: SessionTrackingServiceService) {}

  ngOnInit() {
    this.sessionTrackingSvc
      .getClientSessionStats()
      .pipe(
        mergeMap((stats: ClientSessionState[]) => {
          this.clientSessionStats = stats;

          return forkJoin(
            stats.map(state =>
              this.sessionTrackingSvc.getUserSessionsForClient(state.clientId)
            )
          );
        })
      )
      .subscribe((userSessionsArr: UserSession[][]) => {
        this.userSessions = _.flatten(userSessionsArr);

        console.log(this.clientSessionStats, this.userSessions);
      });
  }
}
