import { Component, OnInit, OnDestroy } from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {App} from '../../../models/app.model';
import {Widget} from '../../../models/widget.model';
import {AuthService} from '../../../services/auth.service';
import {DashboardService} from '../../../services/dashboard.service';
import {GridsterConfig, GridsterItem} from 'angular-gridster2';
import { WidgetGridItem } from 'src/app/models/widget-grid-item.model';
import { UserDashboard } from 'src/app/models/user-dashboard.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  apps: Array<App>;
  options: GridsterConfig;
  dashboard: UserDashboard;
  inEditMode: boolean;
  widgetCardClass: string;

  constructor(private dashSvc: DashboardService, private appsSvc: AppsService, private authSvc: AuthService) { 
    this.apps = new Array<App>();
    this.dashboard = {
      userId : this.authSvc.getUserId(),
      gridItems: []
    };
  }

  ngOnInit() {
    
    this.options = {
      displayGrid: 'none',
      resizable: {
        enabled: false
      },
      draggable: {
        enabled: false
      }
    };
    this.inEditMode = false;
    this.widgetCardClass = 'gridster-card-view-mode';

    this.initHardcode();
    /*
    this.appsSvc.appStoreSub.subscribe(
      (apps: Array<App>) => {
        this.apps = apps;
      },
      (err: any) => {
        console.log(err);
      }
    );

    this.dashSvc.getUserDashboard().subscribe(
      (dashboard: UserDashboard) => {
        this.dashboard = dashboard;
      },
      (err: any) => {
        console.log(err);
      }
    );
    */
  }

  ngOnDestroy() {
    this.appsSvc.appStoreSub.unsubscribe();
  }

  getApp(title: string): App{
    for(let i = 0; i < this.apps.length; i++){
      if(title == this.apps[i].appTitle){
        return this.apps[i];
      }
    }

    return null;
  }

  toggleEditMode(){
    if(this.inEditMode){
      this.inEditMode = false;
      this.options.displayGrid = 'none';
      this.options.draggable.enabled = false;
      this.options.resizable.enabled = false;
      this.widgetCardClass = 'gridster-card-view-mode';
    }
    else{
      this.inEditMode = true;
      this.options.displayGrid = 'always';
      this.options.draggable.enabled = true;
      this.options.resizable.enabled = true;
      this.widgetCardClass = '';
    }
    this.options.api.optionsChanged();
  }

  addWidget(app: App, widget: Widget): void{
    let gridItem: WidgetGridItem = {
      parentAppTitle: app.appTitle,
      widgetTitle: widget.widgetTitle,
      gridsterItem: {
        cols: 1,
        rows: 1,
        x: 0,
        y: 0
      }
    }

    if(widget.gridsterDefault){
      gridItem.gridsterItem = widget.gridsterDefault;
    }

    this.dashboard.gridItems.push(gridItem);

    this.saveDashboard();
  }

  removeWidget(widgetTitle: string): void{
    let i: number = 0;
    let found: boolean = false;
    while(!found){
      if(this.dashboard.gridItems[i].widgetTitle == widgetTitle){
        this.dashboard.gridItems.splice(i,1);
        found = true;
      }
    }

    this.saveDashboard();
  }

  saveDashboard(): void{
    //this.dashSvc.updateUserDashboard(this.dashboard);
  }

  initHardcode(): void{
    this.apps = [
      {
        appTitle: 'Hardcoded Widgets App',
        enabled: true,
        native: true,
        clientId: '123',
        clientName: 'Test Client',
        widgets: []
      }
    ];

    this.apps[0].widgets.push({
      widgetTitle: 'Active User Count',
      widgetBootstrap: '',
      widgetTag: 'active-user-count-widget',
      icon: 'icon-profile'
    });

    this.apps[0].widgets.push({
      widgetTitle: 'Pending User Count',
      widgetBootstrap: '',
      widgetTag: 'pending-user-count-widget',
      icon: 'icon-profile'
    });

    this.apps[0].widgets.push({
      widgetTitle: 'User Chart (Active vs Pending)',
      widgetBootstrap: '',
      widgetTag: 'user-chart-widget',
      icon: 'icon-profile'
    });

    this.apps[0].widgets.push({
      widgetTitle: 'Alerts',
      widgetBootstrap: '',
      widgetTag: 'div',
      icon: 'icon-alerts'
    });

    this.apps[0].widgets.push({
      widgetTitle: 'Chat',
      widgetBootstrap: '',
      widgetTag: 'div',
      icon: 'icon-chat'
    });

    this.apps[0].widgets.push({
      widgetTitle: 'Support',
      widgetBootstrap: '',
      widgetTag: 'div',
      icon: 'icon-support'
    });

    this.apps[0].widgets.push({
      widgetTitle: 'Settings',
      widgetBootstrap: '',
      widgetTag: 'div',
      icon: 'icon-settings'
    });

    this.dashboard.gridItems.push({
      parentAppTitle: 'Hardcoded Widgets App',
      widgetTitle: 'Active User Count',
      gridsterItem: {rows: 1, cols: 1, x: 0, y: 0}
    });

    this.dashboard.gridItems.push({
      parentAppTitle: 'Hardcoded Widgets App',
      widgetTitle: 'Pending User Count',
      gridsterItem: {rows: 1, cols: 1, x: 0, y: 1}
    });

    this.dashboard.gridItems.push({
      parentAppTitle: 'Hardcoded Widgets App',
      widgetTitle: 'User Chart (Active vs Pending)',
      gridsterItem: {rows: 2, cols: 2, x: 1, y: 0}
    });
  }

  
}
