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
    this.listUserApps();
    this.options = {
      displayGrid: 'none',
      resizable: {
        enabled: false
      },
      draggable: {
        enabled: false
      }
    };
    this.dashboard = [
      {cols: 2, rows: 1, y: 0, x: 0},
      {cols: 2, rows: 2, y: 0, x: 2},
      {cols: 2, rows: 2, y: 0, x: 4}
    ];
    this.inEditMode = false;
    this.editText = 'Edit Grid';
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

    let activeUserCountApp: App = {
      appTag: 'active-user-count-widget',
      appTitle: 'Active User Count',
      enabled: true,
      native: true,
      clientId: '123',
      clientName: 'Test Client'
    }

    let pendingUserCountApp: App = {
      appTag: 'pending-user-count-widget',
      appTitle: 'Pending User Count',
      enabled: true,
      native: true,
      clientId: '123',
      clientName: 'Test Client'
    }

    let userChartApp: App = {
      appTag: 'user-chart-widget',
      appTitle: 'Pending Overview (Active vs Pending Users)',
      enabled: true,
      native: true,
      clientId: '123',
      clientName: 'Test Client'
    }

    this.apps.push(activeUserCountApp);
    this.apps.push(pendingUserCountApp);
    this.apps.push(userChartApp);
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

  add(){

  }
}
