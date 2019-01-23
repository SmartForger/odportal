import { Component, OnInit, OnDestroy } from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {App} from '../../../models/app.model';
import { Subscription } from 'rxjs';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit, OnDestroy {

  apps: Array<App>;
  private appUpdatedSub: Subscription;
  private userUpdatedSub: Subscription;
  private refreshInterval: any;

  constructor(
    private appsSvc: AppsService, 
    private authSvc: AuthService,
    private router: Router) { 
    this.apps = new Array<App>();
  }

  ngOnInit() {
    this.listUserApps();
    this.subscribeToAppUpdates();
    this.subscribeToUserUpdates();
    this.setAppRefreshInterval();
  }

  ngOnDestroy() {
    this.appUpdatedSub.unsubscribe();
    this.userUpdatedSub.unsubscribe();
    clearInterval(this.refreshInterval);
  }

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
        this.apps = apps;
        this.verifyAppAccess();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private verifyAppAccess(): void {
    const app: App = this.apps.find((app: App) => {
      if (app.native) {
        return window.location.href.indexOf(app.nativePath) !== -1;
      }
    });
    if (!app) {
      this.router.navigateByUrl('/portal');
    } 
  }

}
