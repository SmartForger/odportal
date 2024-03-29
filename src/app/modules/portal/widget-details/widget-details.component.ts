import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
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
import { iif, Observable, Subscription } from 'rxjs';
import { WidgetGroupAvgRating } from 'src/app/models/feedback-widget.model';
import { FeedbackWidgetService } from 'src/app/services/feedback-widget.service';
import { MatSelectChange } from '@angular/material';
import { WidgetHotbarService } from 'src/app/services/widget-hotbar.service';

@Component({
  selector: 'app-widget-details',
  templateUrl: './widget-details.component.html',
  styleUrls: ['./widget-details.component.scss']
})
export class WidgetDetailsComponent implements OnInit, OnChanges {

  @Input('aww')
  get aww(): AppWithWidget{
    return this._aww;
  }
  set aww(aww: AppWithWidget){
    this._aww = aww;
    this.setVendor().subscribe(() => {
      this.setOtherWidgetVariablesToStartingValues();
      this.subscribeToAppCache();
      this.getRating();
    });
  }
  private _aww: AppWithWidget;
  
  @Input() feedback: any;

  @Output() close: EventEmitter<void>;
  @Output() popout: EventEmitter<AppWithWidget>;
  @Output() addToDashboard: EventEmitter<AppWithWidget>;

  vendor: Vendor;
  otherWidgets: Array<AppWithWidget>;
  subpage: number;
  cacheSub: Subscription;
  rating: WidgetGroupAvgRating;
  readonly WIDGETS_PER_SUBPAGE: number = 6;
  hotbarPosition = 0;

  constructor(
    private authSvc: AuthService, 
    private vendorSvc: VendorsService, 
    private appsSvc: AppsService,
    private router: Router,
    private widgetHotbarSvc: WidgetHotbarService,
    private feedbackWidgetSvc: FeedbackWidgetService) 
  { 
    this.close = new EventEmitter<void>();
    this.popout = new EventEmitter<AppWithWidget>();
    this.addToDashboard = new EventEmitter<AppWithWidget>();
    this.vendor = null;
    this.setOtherWidgetVariablesToStartingValues();
    this.feedback = {};
  }

  ngOnInit() {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.aww && changes.aww.currentValue) {
      const aww = changes.aww.currentValue;
      this.hotbarPosition = this.widgetHotbarSvc.getWidgetPos(aww.app, aww.widget);
    }
  }

  subscribeToAppCache() {
    if(this.cacheSub){
      this.cacheSub.unsubscribe();
    }

    if(this.aww.app.native){
      this.appsSvc.observeLocalAppCache().subscribe((apps) => {
        this.otherWidgets = new Array<AppWithWidget>();
        apps.filter((app: App) => app.native)
        .forEach((app: App) => app.widgets
        .forEach((widget: Widget) => 
          this.otherWidgets.push({app: app, widget: widget
        })));
      });
    }
    else{
      this.appsSvc.observeLocalAppCache().subscribe((apps) => {
        this.otherWidgets = new Array<AppWithWidget>();
        apps.filter((app) => app.vendorId === this.vendor.docId)
        .forEach((app: App) => app.widgets
        .forEach((widget: Widget) => 
          this.otherWidgets.push({app: app, widget: widget
        })));
      });
    }
  }

  setOtherWidgetVariablesToStartingValues(){
    this.otherWidgets = new Array<AppWithWidget>();
    this.subpage = 0;
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

  setVendor(): Observable<void>{
    return new Observable((observer) => {
      let id: string = (this.aww.app.native ? 'fake-vendor-id' : this.aww.app.vendorId);
      this.vendorSvc.fetchById(id).subscribe((vendor: Vendor) => {
        //TEMPORARY HARDCODE UNTIL BACKEND SUPPORT FOR THESE FIELDS IS IMPLEMENTED
        if(!vendor.description){
          vendor.description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
        }
        this.vendor = vendor;
        observer.next(null);
        observer.complete();
      });
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
    return ((this.subpage + 1) * this.WIDGETS_PER_SUBPAGE < this.otherWidgets.length);
  }

  nextSubpage(): void{
    if(this.hasNextSubpage){
      this.subpage++;
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

  getRating(): void{
    this.feedbackWidgetSvc.fetchGroupAverage(this.aww.widget.docId)
    .subscribe(
      (avg: WidgetGroupAvgRating) => {
        this.rating = avg;
      },
      (err: any) => {
        this.rating = null;
      }
    );
  }

  saveToHotbar(ev: MatSelectChange) {
    this.widgetHotbarSvc.saveWidget(ev.value, this.aww.app, this.aww.widget);
  }
}
