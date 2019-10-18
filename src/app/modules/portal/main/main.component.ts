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
import { AjaxProgressService } from 'src/app/ajax-progress/ajax-progress.service';

@Component({
 selector: 'app-main',
 templateUrl: './main.component.html',
 styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit, OnDestroy {

  showFeedback: boolean;
  showNavigation: boolean;
  sidenavOpened: boolean;
  private appUpdatedSub: Subscription;
  private userUpdatedSub: Subscription;
  private showNavSub: Subscription;
  private refreshInterval: any;
  private initialRoutingDone: boolean;

  @ViewChild(WidgetModalComponent) widgetModal: WidgetModalComponent;

  constructor(
    private appsSvc: AppsService,
    private authSvc: AuthService,
    private userSettingsSvc: UserSettingsService,
    private router: Router,
    private widgetModalService: WidgetModalService,
    private ajaxSvc: AjaxProgressService) { 
      this.sidenavOpened = true;
      this.showFeedback = false;
      this.initialRoutingDone = false;
  }

  ngOnInit() {
    this.listUserApps();
    this.subscribeToShowNavUpdates();
    this.subscribeToAppUpdates();
    this.subscribeToUserUpdates();
    this.setAppRefreshInterval();
    this.widgetModalService.modal = this.widgetModal;
//    this.initialNavigation();
  }

  ngOnDestroy() {
    this.appUpdatedSub.unsubscribe();
    this.userUpdatedSub.unsubscribe();
    this.showNavSub.unsubscribe();
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
        this.initialNavigation();
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

  private initialNavigation(): void{
    if(this.authSvc.globalConfig.registrationOnly && !this.initialRoutingDone){
      this.initialRoutingDone = false;
      if(this.authSvc.globalConfig.registrationManagerRoleName && this.authSvc.hasRealmRole(this.authSvc.globalConfig.registrationManagerRoleName)){
        this.ajaxSvc.forceZeroRequests();
        this.router.navigateByUrl('/portal/registration');
      }
      else if(this.authSvc.globalConfig.verificationManagerRoleName && this.authSvc.hasRealmRole(this.authSvc.globalConfig.verificationManagerRoleName)){
        this.ajaxSvc.forceZeroRequests();
        this.router.navigateByUrl('/portal/verification');
      }
      else if(this.authSvc.globalConfig.pendingRoleName && this.authSvc.hasRealmRole(this.authSvc.globalConfig.pendingRoleName)){
        this.ajaxSvc.forceZeroRequests();
        this.router.navigateByUrl('/portal/my-registration');
      }
    }
  }
}