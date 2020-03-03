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
import { VendorsService } from '../../../services/vendors.service';
import { FeedbackWidgetService } from '../../../services/feedback-widget.service';
import { AppWithWidget } from '../../../models/app-with-widget.model';
import { Vendor } from '../../../models/vendor.model';
import { WidgetHotbarService } from 'src/app/services/widget-hotbar.service';
import { ApiSearchCriteria } from '../../../models/api-search-criteria.model';
import { ApiSearchResult } from '../../../models/api-search-result.model';
import { WidgetGroupAvgRating } from '../../../models/feedback-widget.model';

@Component({
  selector: 'app-widget-modal',
  templateUrl: './widget-modal.component.html',
  styleUrls: ['./widget-modal.component.scss'],
})
export class WidgetModalComponent implements OnInit {
  private appCacheSub: Subscription;

  apps: Array<App>;
  detailAww: AppWithWidget;
  private _hidden: boolean;
  vendorMap: any;
  feedback: any;
  widgetFeedbackTimer: any;

  @ViewChild('widgetSearchBar') searchBar: ElementRef<HTMLInputElement>;

  constructor(
    private appService: AppsService,
    private vendorsService: VendorsService,
    private feedbackService: FeedbackWidgetService,
    private authSvc: AuthService,
    private router: Router,
    private dashSvc: DashboardService,
    private widgetWindowsSvc: WidgetWindowsService,
    private widgetHotBarSvc: WidgetHotbarService,
    private cdr: ChangeDetectorRef
  ) {
    this.apps = [];
    this._hidden = true;
    this.detailAww = null;
    this.vendorMap = {};
    this.feedback = {};
  }

  ngOnInit() {
    this.appCacheSub = this.appService.observeLocalAppCache().subscribe(apps => {
      this.apps = apps;
    });
    this.getAllVendors();
    this.getAllWidgetFeedback();

    this.widgetFeedbackTimer = setInterval(() => {
      this.getAllWidgetFeedback();
    }, 30000);
  }

  ngOnDestroy() {
    clearInterval(this.widgetFeedbackTimer);
  }

  onDashboard(): boolean {
    return this.router.url === '/portal/dashboard';
  }

  dashIsTemplate(): boolean {
    return this.dashSvc.activeDashboardIsTemplate;
  }

  addWidget(modelPair: AppWithWidget) {
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
    } else if (app.appIcon) {
      url = UrlGenerator.generateAppResourceUrl(this.authSvc.globalConfig.appsServiceConnection, app, app.appIcon);
    } else {
      url = DefaultAppIcon;
    }
    return url;
  }

  hide(): void {
    this._hidden = true;
    this.detailAww = null;
  }

  show(): void {
    this._hidden = false;
  }

  isHidden(): boolean {
    return this._hidden;
  }

  updateFilter(): void {
    this.cdr.detectChanges();
  }

  filterWidget(title: string): boolean {
    if (this.searchBar.nativeElement.value) {
      return title.toLowerCase().includes(this.searchBar.nativeElement.value.toLowerCase());
    } else {
      return true;
    }
  }

  viewDetails(aww: AppWithWidget) {
    this.detailAww = aww;
  }

  addToHotbar(pos: number, app: App, widget: Widget) {
    this.widgetHotBarSvc.saveWidget(pos, app, widget);
  }

  private getAllVendors(page = 0) {
    const searchCriteria = new ApiSearchCriteria({}, page, 'name', 'asc');
    this.vendorsService.listVendors(searchCriteria).subscribe(
        (result: ApiSearchResult<Vendor>) => {
            result.data.forEach(v => {
                this.vendorMap[v.docId] = v.name;
            });
            if (result.data.length === 50) {
                this.getAllVendors(page + 1);
            }
        },
        (err) => { }
    );
  }

  private getAllWidgetFeedback(page = 0) {
    const searchCriteria = new ApiSearchCriteria({}, 0, 'rating', 'desc');
    this.feedbackService.listGroupAverages(searchCriteria).subscribe(
        (ratings: WidgetGroupAvgRating[]) => {
            ratings.forEach(r => {
                this.feedback[r.widgetId] = r.rating;
            });
        },
        (err) => {}
    );
  }
}
