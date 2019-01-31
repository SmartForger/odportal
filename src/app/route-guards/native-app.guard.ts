import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {AppsService} from '../services/apps.service';
import {Router} from '@angular/router';
import {App} from '../models/app.model';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NativeAppGuard implements CanActivate {

  constructor(private appsSvc: AppsService, private router: Router, private authSvc: AuthService) {

  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log("checking apps");
    return new Observable(observer => {
      if (this.appsSvc.appStore.length) {
        if (this.checkLocalAppStore(state.url)) {
          observer.next(true);
        }
        else {
          this.router.navigateByUrl('/portal');
          observer.next(false);
        }
        observer.complete();
      }
      else {
        this.checkAppStore(state.url).subscribe(
          (canAccess: boolean) => {
            if (canAccess) {
              observer.next(true);
            }
            else {
              this.router.navigateByUrl('/portal');
              observer.next(false);
            }
            observer.complete();
          }
        );
      }
    });
  }

  private checkLocalAppStore(stateUrl: string): boolean {
    const app: App = this.appsSvc.appStore.find((app: App) => {
      return stateUrl.indexOf(app.nativePath) !== -1;
    });
    if (app) {
      return true;
    }
    return false;
  }

  private checkAppStore(stateUrl: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.appsSvc.listUserApps(this.authSvc.getUserId()).subscribe(
        (apps: Array<App>) => {
          const app: App = apps.find((app: App) => {
            return stateUrl.indexOf(app.nativePath) !== -1;
          });
          if (app) {
            observer.next(true);
            observer.complete();
          }
          else {
            observer.next(false);
            observer.complete();
          }
        },
        (err: any) => {
          console.log(err);
          observer.next(false);
          observer.complete();
        }
      );
    }); 
  }


}
