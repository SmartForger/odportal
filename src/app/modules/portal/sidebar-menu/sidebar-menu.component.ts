import { Component, OnInit, OnDestroy } from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {App} from '../../../models/app.model';
import { Subscription } from 'rxjs';
import {UsersService} from '../../../services/users.service';
import {UserProfile} from '../../../models/user-profile.model';
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
  private userUpdatedByIdSub: Subscription;

  constructor(
    private appsSvc: AppsService, 
    private usersSvc: UsersService,
    private authSvc: AuthService,
    private router: Router) { 
    this.apps = new Array<App>();
  }

  ngOnInit() {
    this.listUserApps();
    this.subscribeToAppUpdates();
    this.subscribeToUserUpdates();
    this.subcribeToUserUpdatesById();
  }

  ngOnDestroy() {
    this.appUpdatedSub.unsubscribe();
    this.userUpdatedSub.unsubscribe();
    this.userUpdatedByIdSub.unsubscribe();
  }

  private subscribeToAppUpdates(): void {
    this.appUpdatedSub = this.appsSvc.appSub.subscribe(
      (app: App) => {
        this.listUserApps();
      }
    )
  }

  private subscribeToUserUpdates(): void {
    this.userUpdatedSub = this.usersSvc.userSubject.subscribe(
      (user: UserProfile) => {
        this.checkForRefreshByUserId(user.id);
      }
    );
  }

  private subcribeToUserUpdatesById(): void {
    this.userUpdatedByIdSub = this.usersSvc.userIdSubject.subscribe(
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

  private listUserApps(): void {
    this.appsSvc.listUserApps('smredman').subscribe(
      (apps: Array<App>) => {
        this.apps = apps;
        this.appsSvc.appListRefreshedSub.next(apps);
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
