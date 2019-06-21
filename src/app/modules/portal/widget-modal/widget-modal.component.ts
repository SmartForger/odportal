import { Component, OnInit, Output, EventEmitter, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppsService } from '../../../services/apps.service';
import { App } from '../../../models/app.model';
import { Widget } from '../../../models/widget.model';
import { DashboardService } from 'src/app/services/dashboard.service';
import { WidgetWindowsService } from 'src/app/services/widget-windows.service';
import { Observable, Subscription, Subject } from 'rxjs';
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

  private appCacheSub: Subscription;

  apps: Array<App>;
  detailAww: AppWithWidget;
  private _hidden: boolean;

  @ViewChild('widgetSearchBar') searchBar: ElementRef<HTMLInputElement>;

  constructor(
    private appService: AppsService, 
    private authSvc: AuthService, 
    private router: Router, 
    private dashSvc: DashboardService, 
    private widgetWindowsSvc: WidgetWindowsService,
    private cdr: ChangeDetectorRef) { 
      this.apps = [];
      this._hidden = true;
      this.detailAww = null;
  }

  ngOnInit() {
    this.appCacheSub = this.appService.observeLocalAppCache().subscribe( (apps) => { 
      this.apps = apps;
      let w: Widget = {
        docId: 'speedtest-widget-id',
        widgetTitle: 'Speedtest',
        widgetTag: 'speedtest-widget',
        widgetBootstrap: 'speedtest-widget.js',
        descriptionShort: 'Gotta go FAST!'
      };

      let a: App = {
        appTitle: 'dummy',
        enabled: true,
        native: true,
        clientId: 'dummy',
        clientName: 'dummy',
        widgets: [w]
      };
      this.apps.push(a);
    }  );
  }

  onDashboard(): boolean{
    return this.router.url === '/portal/dashboard';
  }

  addWidget(modelPair: AppWithWidget){
    this.dashSvc.addWidget(modelPair);
  }

  popout(modelPair: AppWithWidget): void {
    this.widgetWindowsSvc.addWindow(modelPair);
    this.hide();
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

  hide(): void{
    this._hidden = true;
    this.detailAww = null;
  }

  show(): void{
    this._hidden = false;
  }

  isHidden(): boolean{
    return this._hidden;
  }

  updateFilter(): void{
    this.cdr.detectChanges();
  }

  filterWidget(title: string): boolean{
    if(this.searchBar.nativeElement.value){
      return title.toLowerCase().includes(this.searchBar.nativeElement.value.toLowerCase());
    }
    else{
      return true;
    }
  }

  viewDetails(aww: AppWithWidget){
    this.detailAww = aww;
  }
}
