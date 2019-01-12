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
    return new Observable(observer => {
      this.appsSvc.listUserApps(this.authSvc.getUserId()).subscribe(
        (apps: Array<App>) => {
          const app: App = apps.find((app: App) => {
            return state.url.indexOf(app.nativePath) !== -1;
          });
          if (app) {
            observer.next(true);
            observer.complete();
          }
          else {
            this.router.navigateByUrl('/portal');
            observer.next(false);
            observer.complete();
          }
        },
        (err: any) => {
          console.log(err);
          this.router.navigateByUrl('/portal');
          observer.next(false);
          observer.complete();
        }
      );
    });
  }
}
