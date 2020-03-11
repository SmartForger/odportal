import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { find } from "lodash";

import { ListItemIcon } from "src/app/models/list-item-icon.model";
import { _pageTabs, _pageSidebarItems } from "./consts";

import { Breadcrumb } from "../../display-elements/breadcrumb.model";
import { BreadcrumbsService } from "../../display-elements/breadcrumbs.service";
import { EnvironmentsServiceService } from "src/app/services/environments-service.service";
import { AuthService } from "src/app/services/auth.service";
import { EnvConfig } from "src/app/models/EnvConfig.model";
import { _MatTabHeaderMixinBase } from "@angular/material/tabs/typings/tab-header";

@Component({
  selector: "app-edit-environment",
  templateUrl: "./edit-environment.component.html",
  styleUrls: ["./edit-environment.component.scss"]
})
export class EditEnvironmentComponent implements OnInit {
  environment: EnvConfig;
  uploads: any;

  currentPageTab: string;
  currentApp: string;

  readonly pageTabs: ListItemIcon[];
  readonly pageSidebarItems: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authSvc: AuthService,
    private envConfigSvc: EnvironmentsServiceService,
    private crumbsSvc: BreadcrumbsService
  ) {
    this.pageTabs = _pageTabs;
    this.pageSidebarItems = _pageSidebarItems;
    this.currentPageTab = _pageTabs[0].value;
    this.currentApp = _pageSidebarItems[this.currentPageTab][0].value;
    this.uploads = {};
    this.environment = {
      name: '',
      ssoUrl: '',
      boundUrl: '',
      classification: 'unclassified'
    };
  }

  ngOnInit() {
    this.getConfig();
  }

  get pageTitle(): string {
    return this.environment
      ? `Edit ${this.environment.name}`
      : "Edit environment";
  }

  goBack() {
    this.router.navigateByUrl("/portal/login-manager/list");
  }

  handlePageTabChange(tab: string) {
    this.currentPageTab = tab;
    if (tab !== "preview") {
      this.currentApp = _pageSidebarItems[this.currentPageTab][0].value;
    }
  }

  handleAppChange(app: string): void {
    this.currentApp = app;
  }

  update(config: EnvConfig) {
    this.envConfigSvc.update(config)
      .subscribe((result: EnvConfig) => {
        this.environment = result;
      });
  }

  private generateCrumbs(): void {
    const crumbs: Array<Breadcrumb> = new Array<Breadcrumb>(
      {
        title: "Dashboard",
        active: false,
        link: "/portal"
      },
      {
        title: "Login Manager",
        active: false,
        link: "/portal/login-manager"
      },
      {
        title: this.environment.name,
        active: true,
        link: null
      }
    );
    this.crumbsSvc.update(crumbs);
  }

  private getConfig() {
    const id = this.route.snapshot.paramMap.get('id');
    this.envConfigSvc.get(id)
      .subscribe((result: EnvConfig) => {
        this.environment = result;
        this.generateCrumbs();
      });
  }

  // private getConfig() {
  //   const boundUrl = this.authSvc.globalConfig.appsServiceConnection.split('/apps-service')[0];
  //   this.envConfigSvc.getLandingConfig(boundUrl)
  //     .subscribe((result: EnvConfig) => {
  //       this.environment = result;
  //       this.generateCrumbs()
  //     });
  // }
}
