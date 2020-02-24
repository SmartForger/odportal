import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { find } from 'lodash';

import { ListItemIcon } from 'src/app/models/list-item-icon.model';
import { _pageTabs, _pageSidebarItems } from "./consts";

import { environmentList } from '../mock-data';

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

  constructor(private router: Router, private route: ActivatedRoute) {
    this.pageTabs = _pageTabs;
    this.pageSidebarItems = _pageSidebarItems;
    this.currentPageTab = _pageTabs[0].value;
    this.currentApp = _pageSidebarItems[this.currentPageTab][0].value;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.environment = find(environmentList, { docId: id });
    console.log(this.environment);
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
