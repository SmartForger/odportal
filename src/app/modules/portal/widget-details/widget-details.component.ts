import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppWithWidget } from 'src/app/models/app-with-widget.model';
import { App } from 'src/app/models/app.model';
import { Widget } from 'src/app/models/widget.model';
import { UrlGenerator } from 'src/app/util/url-generator';
import { DefaultAppIcon } from 'src/app/util/constants';
import { AuthService } from 'src/app/services/auth.service';
import { Vendor } from 'src/app/models/vendor.model';
import { VendorsService } from 'src/app/services/vendors.service';
import { AppsService } from 'src/app/services/apps.service';
import { ApiSearchCriteria } from 'src/app/models/api-search-criteria.model';
import { ApiSearchResult } from 'src/app/models/api-search-result.model';
import { Router } from '@angular/router';
import { iif, Observable } from 'rxjs';

@Component({
  selector: 'app-widget-details',
  templateUrl: './widget-details.component.html',
  styleUrls: ['./widget-details.component.scss']
})
export class WidgetDetailsComponent implements OnInit {

  @Input('aww')
  get aww(): AppWithWidget{
    return this._aww;
  }
  set aww(aww: AppWithWidget){
    //TEMPORARY HARDCODE UNTIL BACKEND SUPPORT FOR THESE FIELDS IS IMPLEMENTED
    if(!aww.widget.descriptionFull){
      aww.widget.descriptionFull = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    }
    if(!aww.widget.rating){
      aww.widget.rating = Math.floor(Math.random() * 6);
    }

    this._aww = aww;
    this.setVendor();
    this.setOtherWidgetVariablesToStartingValues();
    this.appQueryInProgress = true;
    this.addNextPageOfAppsToArray().subscribe(() => {
      this.appQueryInProgress = false;
    });
  }
  private _aww: AppWithWidget;

  @Output() close: EventEmitter<void>;
  @Output() popout: EventEmitter<AppWithWidget>;
  @Output() addToDashboard: EventEmitter<AppWithWidget>;

  vendor: Vendor;
  otherWidgets: Array<AppWithWidget>;
  appQueryInProgress: boolean;
  appRecordsQueried: number;
  totalAppRecords: number;
  page: number;
  subpage: number;
  moreApps: boolean;
  readonly WIDGETS_PER_SUBPAGE: number = 6;

  constructor(
    private authSvc: AuthService, 
    private vendorSvc: VendorsService, 
    private appsSvc: AppsService,
    private router: Router) 
  { 
    this.close = new EventEmitter<void>();
    this.popout = new EventEmitter<AppWithWidget>();
    this.addToDashboard = new EventEmitter<AppWithWidget>();
    this.vendor = null;
    this.setOtherWidgetVariablesToStartingValues();
  }

  ngOnInit() {
    
  }

  setOtherWidgetVariablesToStartingValues(){
    this.otherWidgets = new Array<AppWithWidget>();
    this.appQueryInProgress = false;
    this.appRecordsQueried = 0;
    this.totalAppRecords = 0;
    this.page = -1;
    this.subpage = 0;
    this.moreApps = false;
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

  onDashboard(): boolean{
    return this.router.url === '/portal/dashboard';
  }

  setVendor(): void{
    let id: string = (this.aww.app.native ? 'fake-vendor-id' : this.aww.app.vendorId);
    this.vendorSvc.fetchById(id).subscribe((vendor: Vendor) => {
      //TEMPORARY HARDCODE UNTIL BACKEND SUPPORT FOR THESE FIELDS IS IMPLEMENTED
      if(!vendor.description){
        vendor.description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
      }

      this.vendor = vendor;
    });
  }

  getVendorLogo(): string{
    return `http://docker.emf360.com:49107/logos/${this.vendor.logoImage}`;
  }

  hasPrevSubpage(): boolean{
    return this.subpage > 0;
  }

  prevSubpage(): void{
    if(this.hasPrevSubpage){
      this.subpage--;
    }
  }

  hasNextSubpage(): boolean {
    return ((this.subpage + 1) * this.WIDGETS_PER_SUBPAGE < this.otherWidgets.length) && !this.moreApps;
  }

  nextSubpage(): void{
    if(this.hasNextSubpage){
      if((this.subpage + 1) * this.WIDGETS_PER_SUBPAGE >= this.otherWidgets.length && !this.appQueryInProgress){
        this.appQueryInProgress = true;
        this.addNextPageOfAppsToArray().subscribe(() => {
          this.subpage++;
          this.appQueryInProgress = false;
        });
      }
      else{
        this.subpage++;
      }
    }
  }

  getSubpageArray(): Array<AppWithWidget>{
    if(this.subpage * this.WIDGETS_PER_SUBPAGE < this.otherWidgets.length){
      let index = this.subpage * this.WIDGETS_PER_SUBPAGE;
      return this.otherWidgets.slice(index, index + this.WIDGETS_PER_SUBPAGE);
    }
    else{
      return null;
    }
  }

  addNextPageOfAppsToArray(): Observable<void>{
    return new Observable((observer) => {
      this.page++;

      let searchCriteria: ApiSearchCriteria = new ApiSearchCriteria({}, this.page, 'appTitle', 'asc');
      let added: number = 0;

      iif(() => this.aww.app.native,
        this.appsSvc.listNativeApps(searchCriteria),
        this.appsSvc.listVendorApps(this.aww.app.vendorId, true, searchCriteria)
      ).subscribe((result: ApiSearchResult<App>) => {
        if(!this.totalAppRecords){
          this.totalAppRecords = result.totalRecords;
        }
        this.appRecordsQueried += result.data.length;
        for(let i = 0; i < result.data.length; i++){
          for(let j = 0; j < result.data[i].widgets.length; j++){
            this.otherWidgets.push({app: result.data[i], widget: result.data[i].widgets[j]});
            added++;
          }
        }
        this.moreApps = this.appRecordsQueried < this.totalAppRecords;

        if(added < this.WIDGETS_PER_SUBPAGE && this.moreApps){
          this.addNextPageOfAppsToArray().subscribe(() => {
            observer.next(null);
            observer.complete();
          });
        }
        else{
          observer.next(null);
          observer.complete();
        }
      });
    });
  }


}
