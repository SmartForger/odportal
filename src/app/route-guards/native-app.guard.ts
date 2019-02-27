import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import {AppsService} from '../services/apps.service';
import {Router} from '@angular/router';
import {App} from '../models/app.model';

@Injectable({
  providedIn: 'root'
})
export class NativeAppGuard implements CanActivate {

  constructor(private appsSvc: AppsService, private router: Router) {

  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log("checking apps");
    return new Observable(observer => {
      let sub: Subscription = this.appsSvc.appStoreSub.subscribe(
        (apps: Array<App>) => {
          if (this.checkLocalAppStore(apps, state.url)) {
            observer.next(true);
          }
          else {
            this.router.navigateByUrl('/portal');
            observer.next(false);
          }
          observer.complete();
          sub.unsubscribe();
        }
      );
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
