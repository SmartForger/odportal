/**
 * @description Retrieves the list of apps and places them in the correct array for proper child component distribution
 * @author Steven M. Redman
 */

import { Component, OnInit } from '@angular/core';
import {App} from '../../../models/app.model';
import {AppsService} from '../../../services/apps.service';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';

@Component({
  selector: 'app-list-apps',
  templateUrl: './list-apps.component.html',
  styleUrls: ['./list-apps.component.scss']
})
export class ListAppsComponent implements OnInit {

  nativeApps: Array<App>;
  pendingApps: Array<App>;
  approvedApps: Array<App>;

  constructor(private appsSvc: AppsService, private crumbsSvc: BreadcrumbsService) { 
    this.nativeApps = new Array<App>();
    this.pendingApps = new Array<App>();
    this.approvedApps = new Array<App>();
  }

  ngOnInit() {
    this.listApps();
    this.generateCrumbs();
  }

  private listApps(): void {
    this.appsSvc.listApps().subscribe(
      (apps: Array<App>) => {
        this.nativeApps = apps.filter((app: App) => app.native === true);
        this.pendingApps = apps.filter((app: App) => !app.native && !app.approved);
        this.approvedApps = apps.filter((app: App) => !app.native && app.approved);
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
        link: '/portal'
      },
      {
        title: "MicroApp Manager",
        active: true,
        link: null
      }
    );
    this.crumbsSvc.update(crumbs);
  }

}
