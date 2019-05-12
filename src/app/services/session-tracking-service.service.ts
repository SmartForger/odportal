import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

import { EventRepresentation } from "../models/event-representation";
import { AdminEventRepresentation } from "../models/admin-event-representation";
import { RealmEventsConfigRepresentation } from "../models/realm-events-config-representation";
import { ServerInfoRepresentation } from "../models/server-info-representation";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class SessionTrackingServiceService {
  events: BehaviorSubject<EventRepresentation[]>;
  adminEvents: BehaviorSubject<AdminEventRepresentation[]>;
  config: BehaviorSubject<RealmEventsConfigRepresentation>;
  orgConfig: RealmEventsConfigRepresentation;
  allEventListeners: string[] = [];
  allEventTypes: string[] = [];

  constructor(private http: HttpClient, private authSvc: AuthService) {
    this.events = new BehaviorSubject<EventRepresentation[]>([]);
    this.adminEvents = new BehaviorSubject<AdminEventRepresentation[]>([]);
    this.config = new BehaviorSubject<RealmEventsConfigRepresentation>({
      enabledEventTypes: [],
      eventsListeners: [],
      adminEventsEnabled: false,
      eventsEnabled: false
    });
    this.orgConfig = this.config.value;
    this.getEventsConfig();
  }

  getAdminEvents() {
    const url = this.createRealmAPIUrl() + "/admin-events";

    this.http
      .get(url, {
        headers: this.authSvc.getAuthorizationHeader()
      })
      .subscribe((events: AdminEventRepresentation[]) => {
        this.adminEvents.next(events);
        console.log(events);
      });
  }

  getEvents(currentUser?: boolean) {
    const url = this.createRealmAPIUrl() + "/events";
    const options: any = {
      headers: this.authSvc.getAuthorizationHeader()
    };

    if (currentUser) {
      options.params = {
        user: this.authSvc.getUserId()
      };
    }

    this.http
      .get<EventRepresentation[]>(url, options)
      .subscribe((events: any) => {
        this.events.next(events);
      });
  }

  getEventsConfig() {
    const url = this.createRealmAPIUrl() + "/events/config";

    this.http
      .get<RealmEventsConfigRepresentation>(url, {
        headers: this.authSvc.getAuthorizationHeader()
      })
      .subscribe((config: RealmEventsConfigRepresentation) => {
        this.orgConfig = config;
        this.config.next(config);
      });
  }

  getServerInfo() {
    const url = `${
      this.authSvc.globalConfig.ssoConnection
    }auth/admin/serverinfo`;

    this.http
      .get(url, {
        headers: this.authSvc.getAuthorizationHeader()
      })
      .subscribe((serverinfo: ServerInfoRepresentation) => {
        this.allEventListeners = Object.keys(
          serverinfo.providers.eventsListener.providers
        );
        this.allEventTypes = serverinfo.enums.eventType;
      });
  }

  saveConfig() {
    const url = this.createRealmAPIUrl() + "/events/config";

    this.http
      .put(url, this.config.value, {
        headers: this.authSvc.getAuthorizationHeader()
      })
      .subscribe(() => {
        this.orgConfig = this.config.value;
      });
  }

  clearAdminEvents() {
    const url = this.createRealmAPIUrl() + "/admin-events";

    this.http
      .delete(url, {
        headers: this.authSvc.getAuthorizationHeader()
      })
      .subscribe(() => {
        this.adminEvents.next([]);
      });
  }

  clearEvents() {
    const url = this.createRealmAPIUrl() + "/events";

    this.http
      .delete(url, {
        headers: this.authSvc.getAuthorizationHeader()
      })
      .subscribe(() => {
        this.events.next([]);
      });
  }

  changeEventListeners(evListeners: string[]) {
    this.config.next({
      ...this.config.value,
      eventsListeners: evListeners
    });
  }

  changeEventsEnabled(enabled: boolean) {
    this.config.next({
      ...this.config.value,
      eventsEnabled: enabled
    });
  }

  changeEnabledEventsType(evTypes: string[]) {
    this.config.next({
      ...this.config.value,
      enabledEventTypes: evTypes
    });
  }

  changeAdminEventsEnabled(enabled: boolean) {
    this.config.next({
      ...this.config.value,
      adminEventsEnabled: enabled
    });
  }

  changeExpiration(exp: number) {
    this.config.next({
      ...this.config.value,
      eventsExpiration: exp
    });
  }

  clearChanges() {
    this.config.next(this.orgConfig);
  }

  private createRealmAPIUrl(): string {
    return `${this.authSvc.globalConfig.ssoConnection}auth/admin/realms/${
      this.authSvc.globalConfig.realm
    }`;
  }
}
