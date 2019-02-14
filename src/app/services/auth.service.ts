import { Injectable } from '@angular/core';
import { GlobalConfig } from '../models/global-config.model';
import { Subject } from 'rxjs';
import { UserProfile } from '../models/user-profile.model';
import {HttpHeaders} from '@angular/common/http';

declare var Keycloak: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedInSubject: Subject<boolean>;
  isLoggedIn: boolean;
  sessionUpdatedSubject: Subject<string>;

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
    this.sessionUpdatedSubject = new Subject<string>();
  }

  getAccessToken(): string {
    return this.keycloak.token;
  }

  getAuthorizationHeader(isFormData: boolean = false): any {
    let headers: any;
    if (!isFormData) {
      headers = {
        "Authorization": "Bearer " + this.getAccessToken()
      };
    }
    else {
      headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer ' + this.getAccessToken());
    }
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

  hasPermission(roleName: string, clientId: string): boolean {
    return this.keycloak.hasResourceRole(roleName, clientId);
  }

  updateUserSession(force: boolean = false): void {
    const minValidity: number = force ? 3600 : 5;
    this.keycloak.updateToken(minValidity)
      .success((refreshed: boolean) => {
        if (refreshed) {
          this.sessionUpdatedSubject.next(this.getUserId());
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

  private initKeycloak(): void {
    this.keycloak = Keycloak({
      url: this.globalConfig.ssoConnection + 'auth',
      realm: this.globalConfig.realm,
      clientId: this.globalConfig.publicClientId
    });
    this.keycloak.init({ onLoad: 'login-required' })
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
        this.updateUserSession();
      }
    }, 45000);
  }
}
