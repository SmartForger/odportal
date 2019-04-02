import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppsService } from '../../../services/apps.service';
import { App } from '../../../models/app.model';
import { Widget } from '../../../models/widget.model';
import { DashboardService } from 'src/app/services/dashboard.service';
import { WidgetWindowsService } from 'src/app/services/widget-windows.service';
import { Observable } from 'rxjs';
import { DefaultAppIcon } from '../../../util/constants';
import { UrlGenerator } from '../../../util/url-generator';
import { AuthService } from '../../../services/auth.service';
import { AppWithWidget } from '../../../models/app-with-widget.model';

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
    private widgetWindowsSvc: WidgetWindowsService,
    private authSvc: AuthService) { 
  }

  ngOnInit() {
    this.apps = this.appService.observeLocalAppCache();
  }

  onDashboard(): boolean{
    return this.router.url === '/portal/dashboard';
  }

  addWidget(modelPair: AppWithWidget){
    this.dashSvc.addWidget(modelPair);
  }

  popout(app: App, widget: Widget){
    this.widgetWindowsSvc.addWindow({app: app, widget: widget});
  }

  getWidgetIcon(widget: Widget, app: App): string {
    let url: string;
    if (widget.icon) {
      url = UrlGenerator.generateAppResourceUrl(this.authSvc.globalConfig.appsServiceConnection, app, widget.icon);
    }
    else if (app.appIcon) {
      url = UrlGenerator.generateAppResourceUrl(this.authSvc.globalConfig.appsServiceConnection, app, app.appIcon);
    }
    else {
      url = DefaultAppIcon;
    }
    return url;
  }
}
