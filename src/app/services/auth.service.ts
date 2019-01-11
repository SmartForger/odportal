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

  getAccessToken(): string {
    return this.keycloak.token;
  }

  getAuthorizationHeader(): any {
    let headers = {
      "Authorization": "Bearer " + this.getAccessToken()
    };
    return headers;
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

  getAccountURL(): string {
    return this.keycloak.createAccountUrl();
  }

  getUserId(): string {
    return this.keycloak.subject;
  }

  private initKeycloak(): void {
    this.keycloak = Keycloak({
      url: this.globalConfig.ssoConnection + 'auth',
      realm: this.globalConfig.realm,
      clientId: this.globalConfig.publicClientId
    });
    this.keycloak.init({onLoad: 'login-required'})
    .success((authenticated) => {
      this.initTokenAutoRefresh();
      this.isLoggedIn = true;
      this.loggedInSubject.next(true);
    });
  }

  private initTokenAutoRefresh(): void {
    setInterval(() => {
      console.log("checking token status...");
      if (this.keycloak.isTokenExpired(30)) {
        this.keycloak.updateToken(5)
        .success((refreshed: boolean) => {
          if (refreshed) {
            console.log("Token was successfully refreshed");
          }
          else {
            console.log("Token is still valid");
          }
        })
        .error(() => {
          console.log("Failed to refresh the token, or the session has expired");
          this.keycloak.clearToken();
        });
      }
    }, 45000);
  }
}
