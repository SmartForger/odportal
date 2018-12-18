import { Injectable } from '@angular/core';
import {GlobalConfig} from '../models/global-config.model';
import {Subject} from 'rxjs';
import {UserProfile} from '../models/user-profile.model';

declare var Keycloak: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedInSubject: Subject<boolean>;
  isLoggedIn: boolean;

  private _globalConfig: GlobalConfig;
  set globalConfig(config: GlobalConfig) {
    this._globalConfig = config;
    this.initKeycloak();
  }
  get globalConfig(): GlobalConfig {
    return this._globalConfig;
  }

  private keycloak: any;

  constructor() { 
    this.loggedInSubject = new Subject<boolean>();
    this.isLoggedIn = false;
  }

  getUserProfile(): Promise<UserProfile> {
    return new Promise<UserProfile>((resolve, reject) => {
      this.keycloak.loadUserProfile()
      .success((profile: UserProfile) => {
        resolve(profile);
      })
      .error((err: any) => {
        reject();
      });
    });
  }

  private initKeycloak(): void {
    this.keycloak = Keycloak({
      url: this.globalConfig.ssoConnection + 'auth',
      realm: this.globalConfig.realm,
      clientId: this.globalConfig.publicClientId
    });
    this.keycloak.init({onLoad: 'login-required'})
    .success((authenticated) => {
      this.isLoggedIn = true;
      this.loggedInSubject.next(true);
    });
  }
}
