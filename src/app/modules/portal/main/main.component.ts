import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {Subscription} from 'rxjs';
import {App} from '../../../models/app.model';
import {AppsService} from '../../../services/apps.service';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {UserSettingsService} from '../../../services/user-settings.service';
import { WidgetModalService } from 'src/app/services/widget-modal.service';
import { WidgetModalComponent } from '../widget-modal/widget-modal.component';
import {GlobalConfig} from 'src/app/models/global-config.model';

@Component({
 selector: 'app-main',
 templateUrl: './main.component.html',
 styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit, OnDestroy {

  showFeedback: boolean;
  showNavigation: boolean;
  sidenavOpened: boolean;
  showWidgetControls: boolean;
  private appUpdatedSub: Subscription;
  private userUpdatedSub: Subscription;
  private showNavSub: Subscription;
  private globalConfigSub: Subscription;
  private refreshInterval: any;

  @ViewChild(WidgetModalComponent) widgetModal: WidgetModalComponent;

  constructor(
    private appsSvc: AppsService,
    private authSvc: AuthService,
    private userSettingsSvc: UserSettingsService,
    private router: Router,
    private widgetModalService: WidgetModalService) { 
      this.sidenavOpened = true;
      this.showFeedback = false;
      this.showWidgetControls = false;
  }

  ngOnInit() {
    this.listUserApps();
    this.subscribeToShowNavUpdates();
    this.subscribeToAppUpdates();
    this.subscribeToUserUpdates();
    this.subscribeToGlobalConfig();
    this.setAppRefreshInterval();
    this.widgetModalService.modal = this.widgetModal;
  }

  ngOnDestroy() {
    this.appUpdatedSub.unsubscribe();
    this.userUpdatedSub.unsubscribe();
    this.showNavSub.unsubscribe();
    this.globalConfigSub.unsubscribe();
    clearInterval(this.refreshInterval);
  }

  isPendingUser(): boolean {
    return this.authSvc.hasRealmRole(this.authSvc.globalConfig.pendingRoleName);
  }
  
  private subscribeToAppUpdates(): void {
    this.appUpdatedSub = this.appsSvc.observeAppUpdates().subscribe(
      (app: App) => {
        this.listUserApps();
      }
    )
  }

  private subscribeToUserUpdates(): void {
    this.userUpdatedSub = this.authSvc.observeUserSessionUpdates().subscribe(
        (userId: string) => {
          this.checkForRefreshByUserId(userId);
        }
    );
  }

  private subscribeToShowNavUpdates(): void {
    this.showNavSub = this.userSettingsSvc.observeShowNavigationUpdated().subscribe(
      (show: boolean) => {
        this.showNavigation = show;
      }
    );
  }

  private subscribeToGlobalConfig(): void {
    this.globalConfigSub = this.authSvc.observeGlobalConfigUpdates().subscribe(
      (config: GlobalConfig) => {
        if (config) {
          this.showWidgetControls = config.showDashboardControls;
        }
      }
    );
  }

  private checkForRefreshByUserId(userId: string): void {
    if (userId === this.authSvc.getUserId()) {
      this.listUserApps();
    }
  }

  private setAppRefreshInterval(): void {
    this.refreshInterval = setInterval(() => {
      this.listUserApps();
    }, 60000);
  }

  private listUserApps(): void {
    this.appsSvc.listUserApps(this.authSvc.getUserId()).subscribe(
      (apps: Array<App>) => {
        this.appsSvc.setLocalAppCache(apps);
        this.verifyAppAccess(apps);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private verifyAppAccess(apps: Array<App>): void {
    const app: App = apps.find((app: App) => {
      if (app.native) {
        return window.location.href.indexOf(app.nativePath) !== -1;
      }
      else {
        return window.location.href.indexOf(`app/${app.docId}`) !== -1;
      }
    });
    if (!app && window.location.href.indexOf('/portal/dashboard') !== -1) {
      this.router.navigateByUrl('/portal');
    } 
  }
}