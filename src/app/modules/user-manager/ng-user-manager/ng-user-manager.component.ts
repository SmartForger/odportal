import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UserProfile } from "src/app/models/user-profile.model";
import { UsersService } from "src/app/services/users.service";
import { Breadcrumb } from "../../display-elements/breadcrumb.model";
import { BreadcrumbsService } from "../../display-elements/breadcrumbs.service";
import { KeyValue } from "src/app/models/key-value.model";
import { ListItemIcon } from "src/app/models/list-item-icon.model";
import { _statusOptions, _menuOptions, _pageTabs, _pageSidebarItems } from "./consts";

@Component({
  selector: "ng-user-manager",
  templateUrl: "./ng-user-manager.component.html",
  styleUrls: ["./ng-user-manager.component.scss"]
})
export class NgUserManagerComponent implements OnInit {
  user: UserProfile;

  userStatus: string;
  currentPageTab: string;
  currentApp: string;

  readonly statusOptions: KeyValue[];
  readonly menuOptions: KeyValue[];
  readonly pageTabs: ListItemIcon[];
  readonly pageSidebarItems: any;

  constructor(
    private crumbsSvc: BreadcrumbsService,
    private route: ActivatedRoute,
    private usersSvc: UsersService
  ) {
    this.statusOptions = _statusOptions;
    this.menuOptions = _menuOptions;
    this.pageTabs = _pageTabs;
    this.pageSidebarItems = _pageSidebarItems;
    this.userStatus = _statusOptions[0].value;
    this.currentPageTab = _pageTabs[0].value;
    this.currentApp = _pageSidebarItems[this.currentPageTab][0].value;
  }

  ngOnInit() {
    this.fetchUser();
    this.generateCrumbs();
  }

  get pageTitle(): string {
    return this.user
      ? `Edit ${this.user.firstName} ${this.user.lastName}`
      : "Edit user";
  }

  handleMenuClick(menu: string): void {
    console.log(menu);
  }

  handleStatusChange(status: string): void {
    this.userStatus = status;
    console.log(status);
  }

  handlePageTabChange(tab: string): void {
    this.currentPageTab = tab;
    this.currentApp = this.pageSidebarItems[tab][0].value;
  }

  handleAppChange(app: string): void {
    this.currentApp = app;
    console.log(app);
  }

  private fetchUser(): void {
    this.usersSvc.fetchById(this.route.snapshot.params["id"]).subscribe(
      (user: UserProfile) => {
        this.user = user;
        this.generateCrumbs();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private generateCrumbs(): void {
    const crumbs: Array<Breadcrumb> = new Array<Breadcrumb>(
      {
        title: "Dashboard",
        active: false,
        link: "/portal"
      },
      {
        title: "User Manager",
        active: true,
        link: "/portal/user-manager"
      }
    );
    if (this.user) {
      crumbs[1].active = false;
      crumbs.push({
        title: this.user.username,
        active: true,
        link: null
      });
    }
    this.crumbsSvc.update(crumbs);
  }
}
