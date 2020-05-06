import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs';

import { ListItemIcon } from "src/app/models/list-item-icon.model";
import { _pageTabs, _pageSidebarItems } from "./consts";

import { Breadcrumb } from "../../display-elements/breadcrumb.model";
import { BreadcrumbsService } from "../../display-elements/breadcrumbs.service";
import { EnvironmentsServiceService } from "src/app/services/environments-service.service";
import { AuthService } from "src/app/services/auth.service";
import { NotificationService } from '../../../notifier/notification.service';
import { EnvConfig } from "src/app/models/EnvConfig.model";
import { _MatTabHeaderMixinBase } from "@angular/material/tabs/typings/tab-header";

@Component({
  selector: "app-edit-environment",
  templateUrl: "./edit-environment.component.html",
  styleUrls: ["./edit-environment.component.scss"]
})
export class EditEnvironmentComponent implements OnInit, OnDestroy {
  environment: EnvConfig;
  uploads: any;

  currentPageTab: string;
  currentApp: string;

  pageTabs: ListItemIcon[];
  readonly pageSidebarItems: any;

  boundUrl: string = '';

  actionsSub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authSvc: AuthService,
    private envConfigSvc: EnvironmentsServiceService,
    private crumbsSvc: BreadcrumbsService,
    private notificationSvc: NotificationService
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
    this.boundUrl = this.authSvc.globalConfig.appsServiceConnection.split('/apps-service')[0];

    this.actionsSub = this.notificationSvc.notificationActions.subscribe((action: string) => {
      switch (action) {
        case "configure_support_button":
          this.currentPageTab = 'appearance';
          this.currentApp = 'landing_buttons';
          break;

        case 'configure_smtp':
          this.currentApp = 'smtp_relay';
          break;
        
        default:
          break;
      }
    });
  }

  ngOnInit() {
    this.getConfig();
  }

  ngOnDestroy() {
    this.actionsSub.unsubscribe();
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
    if (tab === "configuration" || tab === 'appearance') {
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
        this.updateTabs();
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
        title: "Landing Page Manager",
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

  private updateTabs() {
    this.pageTabs = [ ..._pageTabs ];

    if (this.environment.faqEnabled) {
      this.pageTabs.push({
        label: "FAQs",
        value: "faqs"
      });
    }
    if (this.environment.videosEnabled) {
      this.pageTabs.push({
        label: "Videos",
        value: "videos"
      });
    }
  }

  private getConfig() {
    const id = this.route.snapshot.paramMap.get('id');
    this.envConfigSvc.get(id)
      .subscribe((result: EnvConfig) => {
        this.environment = result;
        this.generateCrumbs();
        this.updateTabs()
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
