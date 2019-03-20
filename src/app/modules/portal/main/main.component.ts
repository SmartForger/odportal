import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';
import {App} from '../../../models/app.model';
import {AppsService} from '../../../services/apps.service';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {UserSettingsService} from '../../../services/user-settings.service';

declare var $: any;

@Component({
 selector: 'app-main',
 templateUrl: './main.component.html',
 styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit, OnDestroy {

  showNavigation: boolean;
  private appUpdatedSub: Subscription;
  private userUpdatedSub: Subscription;
  private showNavSub: Subscription;
  private refreshInterval: any;

  constructor(
    private appsSvc: AppsService,
    private authSvc: AuthService,
    private userSettingsSvc: UserSettingsService,
    private router: Router) { 
  }

  ngOnInit() {
    this.listUserApps();
    this.subscribeToShowNavUpdates();
    this.subscribeToAppUpdates();
    this.subscribeToUserUpdates();
    this.setAppRefreshInterval();
  }

  ngOnDestroy() {
    this.appUpdatedSub.unsubscribe();
    this.userUpdatedSub.unsubscribe();
    this.showNavSub.unsubscribe();
    clearInterval(this.refreshInterval);
  }

  // toggleNav(): void {
  //   $('body').toggleClass('collapsed');
  //   $('#nav-toggle').toggleClass('expand');
  // }

  private subscribeToAppUpdates(): void {
    this.appUpdatedSub = this.appsSvc.appSub.subscribe(
      (app: App) => {
        this.listUserApps();
      }
    )
  }

  private subscribeToUserUpdates(): void {
    this.userUpdatedSub = this.authSvc.sessionUpdatedSubject.subscribe(
        (userId: string) => {
          this.checkForRefreshByUserId(userId);
        }
    );
  }

  private subscribeToShowNavUpdates(): void {
    this.showNavSub = this.userSettingsSvc.showNavSubject.subscribe(
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
        console.log(apps);
        this.appsSvc.cacheApps(apps);
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

