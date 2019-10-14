import { Component, OnInit, OnDestroy} from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {App} from '../../../models/app.model';
import { Observable, Subscription } from 'rxjs';
import {AuthService} from '../../../services/auth.service';
import {UrlGenerator} from '../../../util/url-generator';
import {DefaultAppIcon} from '../../../util/constants';
import {GlobalConfig} from 'src/app/models/global-config.model';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit, OnDestroy {

  apps: Observable<Array<App>>;
  defaultAppIcon: string;
  showDashboardLink: boolean;

  private globalConfigSub: Subscription;

  constructor(private appsSvc: AppsService, private authSvc: AuthService) { 
    this.defaultAppIcon = DefaultAppIcon;
    this.showDashboardLink = false;
  }

  ngOnInit() {
    this.apps = this.appsSvc.observeLocalAppCache();
    this.subscribeToGlobalConfigUpdates();
  }

  ngOnDestroy() {
    this.globalConfigSub.unsubscribe();
  }

  generateResourceURL(app: App): string {
    return UrlGenerator.generateAppResourceUrl(this.authSvc.globalConfig.appsServiceConnection, app, app.appIcon);
  }
  
  isPendingUser(): boolean {
    return this.authSvc.hasRealmRole(this.authSvc.globalConfig.pendingRoleName);
  }

  private subscribeToGlobalConfigUpdates(): void {
    this.globalConfigSub = this.authSvc.observeGlobalConfigUpdates().subscribe(
      (config: GlobalConfig) => {
        if (config) {
          console.log(config);
          this.showDashboardLink = config.showDashboardControls;
        }
      }
    );
  }
}
