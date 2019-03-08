import { Component, OnInit, ViewChild } from '@angular/core';
import { AppsService } from '../../../services/apps.service';
import { App } from '../../../models/app.model';
import { Widget } from '../../../models/widget.model';
import { AuthService } from '../../../services/auth.service';
import { DashboardService } from '../../../services/dashboard.service';
import { WidgetGridItem } from 'src/app/models/widget-grid-item.model';
import { UserDashboard } from 'src/app/models/user-dashboard.model';
import { DashboardOptionsComponent } from '../dashboard-options/dashboard-options.component';
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
  maximize: boolean;
  maximizedWidgetApp: App;
  maximizedWidget: Widget;
  
  @ViewChild('dashboardOptionsComponent') private dashboardOptionsComponent: DashboardOptionsComponent;
  @ViewChild('dashboardGridsterComponent') private dashboardGridsterComponent: DashboardGridsterComponent;

  constructor(private dashSvc: DashboardService, private appsSvc: AppsService, private authSvc: AuthService) { 
    this.userDashboards = [UserDashboard.createDefaultDashboard(this.authSvc.getUserId())];
    this.dashIndex = 0;
    this.tempDashboard = UserDashboard.createDefaultDashboard(this.authSvc.getUserId());
    this.editMode = false;
  }

  ngOnInit() {
    this.dashSvc.listDashboards().subscribe(
      (dashboards: Array<UserDashboard>) => {
        this.userDashboards = dashboards;
        this.dashIndex = this.userDashboards.findIndex((dash) => dash.default === true);
        if(this.dashIndex === -1){
          this.dashIndex = 0; 
          this.userDashboards[0].default = true;
          this.dashSvc.updateDashboard(this.userDashboards[0]).subscribe();
        }
      },
      (err: any) => {console.log(err);}
    );

    this.dashSvc.addWidgetSubject.subscribe(
      (value: {app: App, widget: Widget}) => {
        this.addWidget(value.app, value.widget);
      },
      (err: any) => {console.log(err);}
    );
  }

  enterEditMode(){
    if(!this.editMode){
      this.tempDashboard = Cloner.cloneObject<UserDashboard>(this.userDashboards[this.dashIndex]);
      this.setEditMode(true);
    }
  }

  leaveEditMode(saveChanges: boolean){
    if(this.editMode){
      this.setEditMode(false);

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

  private setEditMode(editMode: boolean){
    this.editMode = editMode;
    this.dashboardOptionsComponent.editMode = editMode;
    this.dashboardGridsterComponent.editMode = editMode;
  }

  setDashboard(dashIndex: number){
    this.dashIndex = dashIndex;
    this.dashboardGridsterComponent.dashboard = this.userDashboards[dashIndex];
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
  }

  setMaximizedWidget(models: {app: App, widget: Widget}): void{
    this.maximizedWidgetApp = models.app;
    this.maximizedWidget = models.widget;
    this.maximize = true;
  }

  minimizeWidget(): void{
    this.maximize = false;
    this.maximizedWidget = null;
    this.maximizedWidgetApp = null;
  }
}
