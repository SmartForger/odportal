import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { Subscription } from "rxjs";
import { MatSelectChange, MatDialog } from "@angular/material";

import { SessionTrackingServiceService } from "../../../services/session-tracking-service.service";
import { RealmEventsConfigRepresentation } from "../../../models/realm-events-config-representation";
import { ConfirmDialogComponent } from "../../display-elements/confirm-dialog/confirm-dialog.component";

const units = [
  {
    seconds: 60,
    value: "minutes",
    label: "Minutes"
  },
  {
    seconds: 3600,
    value: "hours",
    label: "Hours"
  },
  {
    seconds: 86400,
    value: "days",
    label: "Days"
  }
];

@Component({
  selector: "app-session-tracking-config",
  templateUrl: "./session-tracking-config.component.html",
  styleUrls: ["./session-tracking-config.component.scss"],
  animations: [
    trigger("slideInOut", [
      state(
        "in",
        style({
          overflow: "hidden",
          height: "*",
          marginBottom: "60px"
        })
      ),
      state(
        "out",
        style({
          opacity: "0",
          overflow: "hidden",
          height: "0px",
          marginBottom: "20px"
        })
      ),
      transition("in => out", animate("400ms ease-in-out")),
      transition("out => in", animate("400ms ease-in-out"))
    ])
  ]
})
export class SessionTrackingConfigComponent implements OnInit, OnDestroy {
  isAdminEventsSaved = false;
  isLoginEventsSaved = false;
  config: RealmEventsConfigRepresentation = {};
  subscriptions: Subscription[] = [];
  expiration = 0;
  expirationUnit = "minutes";
  units = units;
  allEventListeners = ["jboss-logging", "email"];

  constructor(
    public sessionTrackingSvc: SessionTrackingServiceService,
    private modal: MatDialog
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.sessionTrackingSvc.config.subscribe(
        (config: RealmEventsConfigRepresentation) => {
          this.config = config;

          if (!config.eventsExpiration) {
            this.expiration = 0;
            this.expirationUnit = "minutes";
          } else {
            for (let i = units.length - 1; i >= 0; i--) {
              if (config.eventsExpiration % units[i].seconds === 0) {
                this.expiration = config.eventsExpiration / units[i].seconds;
                this.expirationUnit = units[i].value;
                break;
              }
            }
          }
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  get adminEventsState() {
    return this.config.adminEventsEnabled ? "in" : "out";
  }

  get loginEventsState() {
    return this.config.eventsEnabled ? "in" : "out";
  }

  updateEventListeners(evListeners: string[]) {
    this.sessionTrackingSvc.changeEventListeners(evListeners);
  }

  updateEventsEnabled(enabled: boolean) {
    this.sessionTrackingSvc.changeEventsEnabled(enabled);
  }

  updateEnabledEventTypes(evTypes: string[]) {
    this.sessionTrackingSvc.changeEnabledEventsType(evTypes);
  }

  clearEvents() {
    const dlgRef = this.modal.open(ConfirmDialogComponent, {
      data: {
        title: "Clear Events",
        message: "Do you want to clear all events?",
        buttons: [
          {
            title: "Clear",
            color: "warn",
            action: "clear"
          }
        ]
      }
    });

    dlgRef.afterClosed().subscribe((action?: string) => {
      if (action === "clear") {
        this.sessionTrackingSvc.clearEvents();
      }
    });
  }

  updateAdminEventsEnabled(enabled: boolean) {
    this.sessionTrackingSvc.changeAdminEventsEnabled(enabled);
  }

  clearAdminEvents() {
    const dlgRef = this.modal.open(ConfirmDialogComponent, {
      data: {
        title: "Clear Admin Events",
        message: "Do you want to clear all admin events?",
        buttons: [
          {
            title: "Clear",
            color: "warn",
            action: "clear"
          }
        ]
      }
    });

    dlgRef.afterClosed().subscribe((action?: string) => {
      if (action === "clear") {
        this.sessionTrackingSvc.clearAdminEvents();
      }
    });
  }

  clearChanges() {
    this.sessionTrackingSvc.clearChanges();
  }

  saveChanges() {
    this.sessionTrackingSvc.saveConfig();
  }

  changeExpiration(val: string) {
    const n = parseInt(val);
    if (Number.isNaN(n)) {
      this.expiration = 0;
      this.sessionTrackingSvc.changeExpiration(0);
    } else {
      this.expiration = n;
      this.sessionTrackingSvc.changeExpiration(this.calcExpirationInSeconds());
    }
  }

  changeExpirationUnit(ev: MatSelectChange) {
    this.expirationUnit = ev.value;
    this.sessionTrackingSvc.changeExpiration(this.calcExpirationInSeconds());
  }

  private calcExpirationInSeconds() {
    const unitsIndex = {
      minutes: 0,
      hours: 1,
      days: 2
    };

    const unit = units[unitsIndex[this.expirationUnit]];

    return this.expiration * unit.seconds;
  }
}
