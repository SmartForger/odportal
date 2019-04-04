/**
 * @description Handles data flow into, between, and out of the dashboard components.
 * @author James Marcu
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { App } from '../../../models/app.model';
import { Widget } from '../../../models/widget.model';
import { AuthService } from '../../../services/auth.service';
import { DashboardService } from '../../../services/dashboard.service';
import { WidgetGridItem } from 'src/app/models/widget-grid-item.model';
import { UserDashboard } from 'src/app/models/user-dashboard.model';
import { DashboardGridsterComponent } from '../dashboard-gridster/dashboard-gridster.component';
import { Cloner } from '../../../util/cloner';

declare var $: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  
  userDashboards: Array<UserDashboard>;
  dashIndex: number;
  tempDashboard: UserDashboard;
  editMode: boolean;

  @ViewChild('dashboardGridsterComponent') dashboardGridsterComponent: DashboardGridsterComponent;

  constructor(
    private dashSvc: DashboardService,
    private authSvc: AuthService)
  { 
    this.userDashboards = [UserDashboard.createDefaultDashboard(this.authSvc.getUserId())];
    this.dashIndex = 0;
    this.tempDashboard = UserDashboard.createDefaultDashboard(this.authSvc.getUserId());
    this.editMode = false;
  }

  ngOnInit() {
    this.dashSvc.listDashboards().subscribe(
      (dashboards: Array<UserDashboard>) => {
        this.userDashboards = dashboards;
        this.setActiveDashboardIndex();
      },
      (err: any) => {console.log(err);}
    );

    this.dashSvc.observeAddWidget().subscribe(
      (value: {app: App, widget: Widget}) => {
        this.addWidget(value.app, value.widget);
      },
      (err: any) => {console.log(err);}
    );
  }

  enterEditMode(){
    if(!this.editMode){
      this.tempDashboard = Cloner.cloneObject<UserDashboard>(this.userDashboards[this.dashIndex]);
      this.editMode = true;
    }
  }

  leaveEditMode(saveChanges: boolean){
    if(this.editMode){
      this.editMode = false;

      if(saveChanges){
        this.dashSvc.updateDashboard(this.userDashboards[this.dashIndex]).subscribe(
          (dashboard) => {this.setDashboard(this.dashIndex);}
        );
      }
      else{
        this.userDashboards[this.dashIndex] = this.tempDashboard;
        this.setDashboard(this.dashIndex);
      }

    }
  }

  setDashboard(dashIndex: number){
    if(dashIndex >= 0 && dashIndex < this.userDashboards.length){
      this.dashIndex = dashIndex;

      if(this.userDashboards[this.dashIndex].docId){
        this.dashSvc.activeDashboardId = this.userDashboards[this.dashIndex].docId;
      }
    }
  }

  addWidget(app: App, widget: Widget): void{
    this.enterEditMode();

    let gridItem: WidgetGridItem = {
      parentAppId: app.docId,
      widgetId: widget.docId,
      gridsterItem: {
        cols: 2,
        rows: 2,
        x: 0,
        y: 0
      }
    }

    if(widget.gridsterDefault){
      gridItem.gridsterItem = widget.gridsterDefault;
    }

    this.userDashboards[this.dashIndex].gridItems.push(gridItem);

    this.setDashboard(this.dashIndex);
    this.dashboardGridsterComponent.dashboard = this.userDashboards[this.dashIndex];
  }

  private setActiveDashboardIndex(): void{
    this.dashIndex = this.userDashboards.findIndex((dashboard) => dashboard.docId === this.dashSvc.activeDashboardId);
    if(this.dashIndex === -1){
      this.dashIndex = this.userDashboards.findIndex((dashboard) => dashboard.default);

      if(this.dashIndex === -1){
        this.dashIndex = 0; 
        this.userDashboards[0].default = true;
        this.dashSvc.updateDashboard(this.userDashboards[0]).subscribe();
      }
    }
  }
  
}
