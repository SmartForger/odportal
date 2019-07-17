/**
 * @description Handles data flow into, between, and out of the dashboard components.
 * @author James Marcu
 */

import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { App } from '../../../models/app.model';
import { Widget } from '../../../models/widget.model';
import { AuthService } from '../../../services/auth.service';
import { DashboardService } from '../../../services/dashboard.service';
import { WidgetGridItem } from 'src/app/models/widget-grid-item.model';
import { UserDashboard } from 'src/app/models/user-dashboard.model';
import { DashboardGridsterComponent } from '../dashboard-gridster/dashboard-gridster.component';
import { Cloner } from '../../../util/cloner';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  
  userDashboards: Array<UserDashboard>;
  dashIndex: number;
  tempDashboard: UserDashboard;
  editMode: boolean;
  addWidgetSub: Subscription;

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
        if (dashboards.length) {
          this.userDashboards = dashboards;
          this.setActiveDashboardIndex();
        }
        else {
          this.createDefaultDashboard(this.userDashboards[0]);
        }
      },
      (err: any) => {console.log(err);}
    );

    this.addWidgetSub = this.dashSvc.observeAddWidget().subscribe(
      (value: {app: App, widget: Widget}) => {
        this.addWidget(value.app, value.widget);
      },
      (err: any) => {console.log(err);}
    );
  }

  ngOnDestroy(){
    this.addWidgetSub.unsubscribe();
  }

  private createDefaultDashboard(dashboard: UserDashboard): void {
    this.dashSvc.addDashboard(dashboard).subscribe(
      (newDashboard: UserDashboard) => {
        this.userDashboards[0] = newDashboard;
        this.setActiveDashboardIndex();
      },
      (err: any) => {
        console.log(err);
      }
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
      if(saveChanges){
        this.dashSvc.updateDashboard(this.userDashboards[this.dashIndex]).subscribe((dashboard) => {
          this.setDashboard(this.dashIndex);
          this.editMode = false;
        });
      }
      else{
        this.userDashboards[this.dashIndex] = this.tempDashboard;
        this.setDashboard(this.dashIndex);
        this.editMode = false;
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
    let gridsterItem = this.dashboardGridsterComponent.getGridsterItem();
    let gridItem: WidgetGridItem = {
      parentAppId: app.docId,
      widgetId: widget.docId,
      gridsterItem: gridsterItem
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
