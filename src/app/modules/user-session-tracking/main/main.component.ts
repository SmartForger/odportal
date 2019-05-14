import { Component, OnInit, ViewEncapsulation } from "@angular/core";

import { SessionTrackingServiceService } from "../../../services/session-tracking-service.service";
import { Breadcrumb } from "../../display-elements/breadcrumb.model";
import { BreadcrumbsService } from "../../display-elements/breadcrumbs.service";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit {
  selectedTabIndex: number;

  constructor(
    private crumbsSvc: BreadcrumbsService,
    private sessionTrackingSvc: SessionTrackingServiceService
  ) {}

  ngOnInit() {
    this.generateCrumbs();
    this.sessionTrackingSvc.getServerInfo();
  }

  private generateCrumbs(): void {
    const crumbs: Array<Breadcrumb> = new Array<Breadcrumb>(
      {
        title: "Dashboard",
        active: false,
        link: "/portal"
      },
      {
        title: "Session Manager",
        active: true,
        link: "/portal/user-session-tracking"
      }
    );
    this.crumbsSvc.update(crumbs);
  }
}
