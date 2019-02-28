import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscription} from 'rxjs';
import {AppsService} from '../services/apps.service';
import {Router} from '@angular/router';
import {App} from '../models/app.model';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NativeAppGuard implements CanActivate {

  private sub: Subscription;

  constructor(
    private appsSvc: AppsService,
    private authSvc: AuthService,
    private router: Router) {

  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log("checking apps");
    return new Observable(observer => {
      if (this.appsSvc.appStore.length) {
        if (this.checkLocalAppStore(this.appsSvc.appStore, state.url)) {
          observer.next(true);
        }
        else {
          observer.next(false);
          this.router.navigateByUrl('/portal');
        }
        observer.complete();
      }
      else {
        this.appsSvc.listUserApps(this.authSvc.getUserId()).subscribe(
          (apps: Array<App>) => {
            if (this.checkLocalAppStore(apps, state.url)) {
              observer.next(true);
            }
            else {
              observer.next(false);
              this.router.navigateByUrl('/portal');
            }
            observer.complete();
          },
          (err: any) => {
            console.log(err);
          }
        );
      }
    });
  }

  private checkLocalAppStore(apps: Array<App>, stateUrl: string): boolean {
    const app: App = apps.find((app: App) => {
      return stateUrl.indexOf(app.nativePath) !== -1;
    });
    if (app) {
      return true;
    }
    return false;
  }

}
