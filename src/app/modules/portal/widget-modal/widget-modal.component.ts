import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppsService } from '../../../services/apps.service';
import { App } from '../../../models/app.model';
import { Widget } from '../../../models/widget.model';
import { DashboardService } from 'src/app/services/dashboard.service';
import { WidgetWindowsService } from 'src/app/services/widget-windows.service';
import {Observable} from 'rxjs';


@Component({
  selector: 'app-widget-modal',
  templateUrl: './widget-modal.component.html',
  styleUrls: ['./widget-modal.component.scss']
})
export class WidgetModalComponent implements OnInit {

  apps: Observable<Array<App>>;

  constructor(
    private appService: AppsService,  
    private router: Router, 
    private dashSvc: DashboardService, 
    private widgetWindowsSvc: WidgetWindowsService) { 
  }

  ngOnInit() {
    this.apps = this.appService.appStoreSub.asObservable();
  }

  onDashboard(): boolean{
    return this.router.url === '/portal/dashboard';
  }

  addWidget(app: App, widget: Widget){
    this.dashSvc.addWidget(app, widget);
  }

  popout(app: App, widget: Widget){
    this.widgetWindowsSvc.addWindowSub.next({app: app, widget: widget});
  }
}
