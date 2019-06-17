/**
 * @description Shows/hides a loading spinner based on route change events. Useful for showing progress when lazy-loading modules.
 * @author Steven M. Redman
 */

import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { NavigationStart, NavigationEnd, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-loading",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.scss"]
})
export class LoadingComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[];
  isLoading: boolean;
  keycloakInited: boolean;

  constructor(private router: Router, private authSvc: AuthService) {
    this.isLoading = true;
    this.subscriptions = [
      this.authSvc.keycloakInited.subscribe((inited: boolean) => {
        this.keycloakInited = inited;
      })
    ];
  }

  ngOnInit() {
    this.subscribeToRouteEvents();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  private subscribeToRouteEvents(): void {
    this.subscriptions.push(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          this.isLoading = true;
        } else if (event instanceof NavigationEnd) {
          this.isLoading = false;
        }
      })
    );
  }
}
