import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ListItemIcon } from 'src/app/models/list-item-icon.model';
import { _pageTabs, _pageSidebarItems } from "./consts";

@Component({
  selector: 'app-edit-environment',
  templateUrl: './edit-environment.component.html',
  styleUrls: ['./edit-environment.component.scss']
})
export class EditEnvironmentComponent implements OnInit {
  environment: any;

  currentPageTab: string;
  currentApp: string;

  readonly pageTabs: ListItemIcon[];
  readonly pageSidebarItems: any;

  constructor(private router: Router) {
    this.pageTabs = _pageTabs;
    this.pageSidebarItems = _pageSidebarItems;
    this.currentPageTab = _pageTabs[0].value;
    this.currentApp = _pageSidebarItems[this.currentPageTab][0].value;
  }

  ngOnInit() {
  }

  get pageTitle(): string {
    return this.environment
      ? `Edit ${this.environment.environment}`
      : "Edit environment";
  }

  goBack() {
    this.router.navigateByUrl('/portal/login-manager/list');
  }

  handlePageTabChange(tab: string) {
    this.currentPageTab = tab;
    if (tab !== 'preview') {
      this.currentApp = _pageSidebarItems[this.currentPageTab][0].value;
    }
  }

  handleAppChange(app: string): void {
    this.currentApp = app;
    console.log(app);
  }

}
