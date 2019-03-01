import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {App} from '../../../models/app.model';
import {Widget} from '../../../models/widget.model';
import {AuthService} from '../../../services/auth.service';
import {DashboardService} from '../../../services/dashboard.service';
import {GridsterConfig, GridsterItem} from 'angular-gridster2';
import { WidgetGridItem } from 'src/app/models/widget-grid-item.model';
import { UserDashboard } from 'src/app/models/user-dashboard.model';
import { ModalComponent } from '../../display-elements/modal/modal.component';

declare var $: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  apps: Array<App>;
  options: GridsterConfig;
  dashboard: UserDashboard;
  tempDashboard: UserDashboard;
  inEditMode: boolean;
  widgetCardClass: string;
  indexToDelete: number;

  @ViewChild('confirmWidgetDeletionModal') private widgetDeletionModal: ModalComponent;

  constructor(private dashSvc: DashboardService, private appsSvc: AppsService, private authSvc: AuthService) { 
    this.apps = new Array<App>();
    this.dashboard = {
      userId : this.authSvc.getUserId(),
      gridItems: []
    };
    this.tempDashboard = {
      userId: '',
      gridItems: []
    }
  }

  ngOnInit() {
    
    this.options = {
      gridType: 'fit',
      minCols: 16,
      minRows: 16,
      defaultItemCols: 4,
      defaultItemRows: 4,
      displayGrid: 'none',
      margin: 25,
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
    //this.appsSvc.appStoreSub.unsubscribe();
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
      this.deepCopyDashboard(this.dashboard, this.tempDashboard);
    }
    this.options.api.optionsChanged();
  }

  addWidget(app: App, widget: Widget): void{
    let gridItem: WidgetGridItem = {
      parentAppTitle: app.appTitle,
      widgetTitle: widget.widgetTitle,
      gridsterItem: {
        cols: 4,
        rows: 4,
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
  
  confirmDelete(widgetIndex: number): void{
    this.indexToDelete = widgetIndex;
    this.widgetDeletionModal.show = true;
  }

  removeWidget(buttonTitle: string): void{
    this.widgetDeletionModal.show = false;
    if(buttonTitle === 'confirm'){
      this.dashboard.gridItems.splice(this.indexToDelete, 1);

      this.saveDashboard();
    }
  }

  revertChanges(): void{
    this.deepCopyDashboard(this.tempDashboard, this.dashboard);
  }

  saveDashboard(): void{
    //this.dashSvc.updateUserDashboard(this.dashboard);
  }

  private deepCopyDashboard(copyFrom: UserDashboard, copyTo: UserDashboard){
    copyTo.userId = copyFrom.userId;
    copyTo.gridItems = [];

    for(let i = 0; i < copyFrom.gridItems.length; i++){
      let tempGridsterItem: GridsterItem = {
        cols: copyFrom.gridItems[i].gridsterItem.cols,
        rows: copyFrom.gridItems[i].gridsterItem.rows,
        x: copyFrom.gridItems[i].gridsterItem.x,
        y: copyFrom.gridItems[i].gridsterItem.y
      }

      let tempWGI: WidgetGridItem = {
        parentAppTitle: copyFrom.gridItems[i].parentAppTitle,
        widgetTitle: copyFrom.gridItems[i].widgetTitle,
        gridsterItem: tempGridsterItem
      }

      copyTo.gridItems.push(tempWGI);
    }
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
      icon: 'icon-active-users'
    });

    this.apps[0].widgets.push({
      widgetTitle: 'Pending User Count',
      widgetBootstrap: '',
      widgetTag: 'pending-user-count-widget',
      icon: 'icon-pending-users'
    });

    this.apps[0].widgets.push({
      widgetTitle: 'User Chart (Active vs Pending)',
      widgetBootstrap: '',
      widgetTag: 'user-chart-widget',
      icon: 'icon-users'
    });

    this.apps[0].widgets.push({
      widgetTitle: 'User Count',
      widgetBootstrap: '',
      widgetTag: 'user-count-widget',
      icon: 'icon-users'
    })

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
      gridsterItem: {rows: 4, cols: 4, x: 0, y: 0}
    });

    this.dashboard.gridItems.push({
      parentAppTitle: 'Hardcoded Widgets App',
      widgetTitle: 'Pending User Count',
      gridsterItem: {rows: 4, cols: 4, x: 0, y: 4}
    });

    this.dashboard.gridItems.push({
      parentAppTitle: 'Hardcoded Widgets App',
      widgetTitle: 'User Chart (Active vs Pending)',
      gridsterItem: {rows: 8, cols: 8, x: 4, y: 0}
    });

    this.dashboard.gridItems.push({
      parentAppTitle: 'Hardcoded Widgets App',
      widgetTitle: 'User Count',
      gridsterItem: {rows: 2, cols: 6, x: 0, y: 8}
    });
  }

  
}
