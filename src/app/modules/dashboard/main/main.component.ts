import { Component, OnInit } from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {App} from '../../../models/app.model';
import {AuthService} from '../../../services/auth.service';
import {GridsterConfig, GridsterItem} from 'angular-gridster2';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  apps: Array<App>;
  options: GridsterConfig;
  dashboard: Array<GridsterItem>;
  inEditMode: boolean;
  editText: string;

  constructor(private appsSvc: AppsService, private authSvc: AuthService) { 
    this.apps = new Array<App>();
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
    this.dashboard = [ ];
    this.inEditMode = false;
    this.editText = 'Edit Grid';
    this.listUserApps();
  }

  private listUserApps(): void {
    /*
    this.appsSvc.listUserApps(this.authSvc.getUserId()).subscribe(
      (apps: Array<App>) => {
        this.apps = apps;
      },
      (err: any) => {
        console.log(err);
      }
    );
    */
    this.addWidget('activeUserCount');
    this.addWidget('pendingUserCount');
    this.addWidget('userChart');
  }

  toggleEditMode(){
    if(this.inEditMode){
      this.inEditMode = false;
      this.options.displayGrid = 'none';
      this.options.draggable.enabled = false;
      this.options.resizable.enabled = false;
      this.editText = 'Edit Grid';
    }
    else{
      this.inEditMode = true;
      this.options.displayGrid = 'always';
      this.options.draggable.enabled = true;
      this.options.resizable.enabled = true;
      this.editText = 'Save Grid';
    }
    this.options.api.optionsChanged();
  }

  generateAppModel(widget: string): App{
    let widgetModel: App = {
      appTitle: '',
      enabled: true,
      native: true,
      clientId: '123',
      clientName: 'Test Client'
    };

    switch(widget){
      case 'activeUserCount': {
        widgetModel.appTag = 'active-user-count-widget';
        widgetModel.appTitle = 'Active User Count';
        break;
      }
      case 'pendingUserCount': {
        widgetModel.appTag = 'pending-user-count-widget';
        widgetModel.appTitle = 'Pending User Count';
        break;
      }
      case 'userChart': {
        widgetModel.appTag = 'user-chart-widget';
        widgetModel.appTitle = 'Pending Overview (Active vs Pending Users)';
        break;
      }
      default: {
        widgetModel.appTag = 'div';
        widgetModel.appTitle = 'Test App';
      }
    }

    return widgetModel;
  }

  addWidget(widget: string){
    let widgetModel: App = this.generateAppModel(widget);
    let gridsterItem: GridsterItem = {cols: 1, rows: 1, x: 0, y: 0};
    this.apps.push(widgetModel);
    this.dashboard.push(gridsterItem);
  }

  removeWidget(indexToRemove: number): void{
    if(indexToRemove > -1){
      this.apps.splice(indexToRemove, 1);
      this.dashboard.splice(indexToRemove, 1);
    }
  }
}
