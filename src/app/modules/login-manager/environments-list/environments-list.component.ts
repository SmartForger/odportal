import { Component, OnInit } from '@angular/core';

import { BreadcrumbsService } from '../../display-elements/breadcrumbs.service';
import { Breadcrumb } from '../../display-elements/breadcrumb.model';

import { environmentList } from '../mock-data';

@Component({
  selector: 'app-environments-list',
  templateUrl: './environments-list.component.html',
  styleUrls: ['./environments-list.component.scss']
})
export class EnvironmentsListComponent implements OnInit {

  allItems = environmentList;

  constructor(private crumbsSvc: BreadcrumbsService) { }

  ngOnInit() {
    this.generateCrumbs();
  }

  private generateCrumbs(): void {
    const crumbs: Array<Breadcrumb> = new Array<Breadcrumb>(
      {
        title: "Dashboard",
        active: false,
        link: "/portal"
      },
      {
        title: "Login manager",
        active: true,
        link: null
      }
    );
    this.crumbsSvc.update(crumbs);
  }
}
