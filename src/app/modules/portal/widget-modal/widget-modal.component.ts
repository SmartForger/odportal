import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppsService } from '../../../services/apps.service';
import { AuthService } from '../../../services/auth.service';
import { App } from '../../../models/app.model';
import { Widget } from '../../../models/widget.model';
import { DashboardService } from 'src/app/services/dashboard.service';


@Component({
  selector: 'app-widget-modal',
  templateUrl: './widget-modal.component.html',
  styleUrls: ['./widget-modal.component.scss']
})
export class WidgetModalComponent implements OnInit {

  apps: Array<App>;

  constructor(private appService: AppsService, private authService: AuthService, private router: Router, private dashSvc: DashboardService) { 
    this.apps = [];
  }

  ngOnInit() {
    /*
    this.appService.listUserApps(this.authService.getUserId()).subscribe(
      (apps: Array<App>) => {
        this.apps = apps;
      },
      (err: any) => {
        console.log(err);
      }
    );
    */

    this.createHardcodedApps();
  }

  onDashboard(): boolean{
    return this.router.url === '/portal/dashboard';
  }

  addWidget(app: App, widget: Widget){
    this.dashSvc.addWidget(app, widget);
  }

  createHardcodedApps(): void{
    
    this.apps.push({
      docId: 'hwa-id',
      appTitle: 'Hardcoded Widgets App',
      enabled: true,
      native: true,
      clientId: '123',
      clientName: 'Test Client',
      widgets: []
    });

    let index: number = this.apps.length - 1;

    this.apps[index].widgets.push({
      docId: 'auc-id',
      widgetTitle: 'Active User Count',
      widgetBootstrap: '',
      widgetTag: 'active-user-count-widget',
      icon: 'icon-active-users'
    });

    this.apps[index].widgets.push({
      docId: 'puc-id',
      widgetTitle: 'Pending User Count',
      widgetBootstrap: '',
      widgetTag: 'pending-user-count-widget',
      icon: 'icon-pending-users'
    });

    this.apps[index].widgets.push({
      docId: 'ucavp-id',
      widgetTitle: 'User Chart (Active vs Pending)',
      widgetBootstrap: '',
      widgetTag: 'user-chart-widget',
      icon: 'icon-users'
    });

    this.apps[index].widgets.push({
      docId: 'uc-id',
      widgetTitle: 'User Count',
      widgetBootstrap: '',
      widgetTag: 'user-count-widget',
      icon: 'icon-users'
    })

    this.apps[index].widgets.push({
      widgetTitle: 'Alerts',
      widgetBootstrap: '',
      widgetTag: 'div',
      icon: 'icon-alerts'
    });

    this.apps[index].widgets.push({
      widgetTitle: 'Chat',
      widgetBootstrap: '',
      widgetTag: 'div',
      icon: 'icon-chat'
    });

    this.apps[index].widgets.push({
      widgetTitle: 'Support',
      widgetBootstrap: '',
      widgetTag: 'div',
      icon: 'icon-support'
    });

    this.apps[index].widgets.push({
      widgetTitle: 'Settings',
      widgetBootstrap: '',
      widgetTag: 'div',
      icon: 'icon-settings'
    });

  }
}
