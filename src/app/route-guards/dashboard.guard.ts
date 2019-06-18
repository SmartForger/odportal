import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanLoad {

  constructor(private authSvc: AuthService) {}
      
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return !this.authSvc.hasRealmRole(this.authSvc.globalConfig.pendingRoleName);
  }
}
