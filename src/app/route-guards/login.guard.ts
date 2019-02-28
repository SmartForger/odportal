import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';
import {LocalStorageService} from '../services/local-storage.service';
import {CommonLocalStorageKeys} from '../util/constants';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private authSvc: AuthService, private lsSvc: LocalStorageService) {

  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log("logged-in guard");
    if (this.authSvc.isLoggedIn) {
      return true;
    }
    else {
      this.lsSvc.setItem(CommonLocalStorageKeys.RedirectURI, state.url);
      return false;
    }
  }
}
