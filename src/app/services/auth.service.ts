/**
 * @description Authentication service that wraps Keycloak and alerts the system of changes to the login/session status of the logged-in user. Not really testable because of the required Keycloak instance.
 * @author Steven M. Redman
 */

import { Injectable } from '@angular/core';
import { GlobalConfig } from '../models/global-config.model';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { UserProfile } from '../models/user-profile.model';
import {HttpHeaders} from '@angular/common/http';
import {UserState} from '../models/user-state.model';
import {ClientWithRoles} from '../models/client-with-roles.model';
import {HttpRequestMonitorService} from './http-request-monitor.service';
import * as uuid from 'uuid';
import {HttpSignatureKey} from '../util/constants';
import {environment as env} from '../../environments/environment';

declare var Keycloak: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInSubject: Subject<boolean>;
  isLoggedIn: boolean;
  private sessionUpdatedSubject: Subject<string>;
  userState: UserState;
  private globalConfigSetSubject: BehaviorSubject<GlobalConfig>;
  keycloakInited: BehaviorSubject<boolean>;

  private _globalConfig: GlobalConfig;
  set globalConfig(config: GlobalConfig) {
    this._globalConfig = config;
    if (!env.testing) {
      this.initKeycloak();
      this.globalConfigSetSubject.next(this._globalConfig);
    }
    else {
      //We bypass instantiating Keycloak for tests
      this.isLoggedIn = true;
      this.loggedInSubject.next(true);
    }
  }
  get globalConfig(): GlobalConfig {
    return this._globalConfig;
  }

  private keycloak: any;

  constructor(private httpMonitorSvc: HttpRequestMonitorService) {
    this.loggedInSubject = new Subject<boolean>();
    this.isLoggedIn = false;
    this.keycloakInited = new BehaviorSubject<boolean>(false);
    this.sessionUpdatedSubject = new Subject<string>();
    this.globalConfigSetSubject = new BehaviorSubject<GlobalConfig>(null);
    //For testing, we apply mock values directly so initKeycloak does not get called
    if (env.testing) {
      this._globalConfig = {
        ssoConnection: "https://mock-sso/",
        realm: "mock-realm",
        appsServiceConnection: "http://mock-apps/",
        userProfileServiceConnection: "http://mock-user-profile/",
        vendorsServiceConnection: "http://mock-vendors/",
        pendingRoleId: "pending"
      };
    }
  }

  getAccessToken(): string {
    if (!env.testing) {
      return this.keycloak.token;
    }
    //return mock value for testing
    else {
      return "mock-token";
    }
  }

  getCoreServicesArray(): Array<string> {
    return new Array<string>(
      this.globalConfig.ssoConnection,
      this.globalConfig.userProfileServiceConnection,
      this.globalConfig.servicesServiceConnection,
      this.globalConfig.vendorsServiceConnection,
      this.globalConfig.appsServiceConnection
    );
  }

  getCoreServicesMap(): Object {
    return {
      ssoConnection: this.globalConfig.ssoConnection,
      userProfileServiceConnection: this.globalConfig.userProfileServiceConnection,
      servicesServiceConnection: this.globalConfig.servicesServiceConnection,
      vendorsServiceConnection: this.globalConfig.vendorsServiceConnection,
      appsServiceConnection: this.globalConfig.appsServiceConnection,
      registrationServiceConnection: this.globalConfig.registrationServiceConnection,
      speedtestServiceConnection: `http://docker.emf360.com:49144/`
    };
  }

  getAuthorizationHeader(isFormData: boolean = false): any {
    let headers: any;
    const signature: string = uuid.v4();
    if (!isFormData) {
      headers = {
        "Authorization": "Bearer " + this.getAccessToken()
      };  
      //headers[HttpSignatureKey] = signature;
    }
    else {
      headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer ' + this.getAccessToken());
      //headers = headers.set(HttpSignatureKey, signature);
    }
    //this.httpMonitorSvc.addSignature(signature);
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
    if(!env.testing){
      return this.keycloak.subject;
    }
    //return mock value for testing
    else{
      return "fake-user-id";
    }
  }

  hasPermission(roleName: string, clientId: string): boolean {
    return this.keycloak.hasResourceRole(roleName, clientId);
  }

  hasRealmRole(roleName: string): boolean{
    return this.keycloak.hasRealmRole(roleName);
  }

  updateUserSession(force: boolean = false): void {
    const minValidity: number = force ? 3600 : 5;
    this.keycloak.updateToken(minValidity)
      .success((refreshed: boolean) => {
        if (refreshed) {
          console.log("Token was successfully refreshed");
        }
        else {
          console.log("Token is still valid");
        }
        this.createUserState()
        .then((state: UserState) => {
          this.userState = state;
          this.sessionUpdatedSubject.next(this.getUserId());
        })
        .catch((err) => {
          console.log(err);
          this.sessionUpdatedSubject.next(this.getUserId());
        });
      })
      .error(() => {
        console.log("Failed to refresh the token, or the session has expired");
        //this.keycloak.clearToken();
        this.logout();
      });
  }

  observeLoggedInUpdates(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  observeUserSessionUpdates(): Observable<string> {
    return this.sessionUpdatedSubject.asObservable();
  }

  observeGlobalConfigUpdates(): Observable<GlobalConfig> {
    return this.globalConfigSetSubject.asObservable();
  }

  logout(): void {
    this.keycloak.logout();
  }

  login(): void {
    this.keycloak.login();
  }

  private initKeycloak(): void {
    this.keycloak = Keycloak({
      url: this.globalConfig.ssoConnection + 'auth',
      realm: this.globalConfig.realm,
      clientId: this.globalConfig.publicClientId
    });
    this.keycloakInited.next(false);
    this.keycloak.init({ onLoad: 'check-sso' })
      .success((authenticated) => {
        this.createUserState()
        .then((state: UserState) => {
          this.userState = state;
          this.initTokenAutoRefresh();
          this.isLoggedIn = true;
          this.keycloakInited.next(true);
          this.loggedInSubject.next(true);
        })
        .catch((err) => {
          console.log(err);
          this.keycloakInited.next(true);
          this.keycloak.clearToken();
        });
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

  private createUserState(): Promise<UserState> {
    return new Promise<UserState>((resolve, reject) => {
      this.getUserProfile()
      .then((profile: UserProfile) => {
        const userState: UserState = {
          userId: this.getUserId(),
          realm: this.globalConfig.realm,
          userProfile: profile,
          realmAccess: this.keycloak.tokenParsed.realm_access.roles,
          resourceAccess: this.getUserStateClientRoles()
        };
        resolve(userState);
      })
      .catch((err: any) => {
        reject(err);
      }); 
    });
  }

  private getUserStateClientRoles(): Array<ClientWithRoles> {
    let cwrs: Array<ClientWithRoles> = new Array<ClientWithRoles>();
    for (const key in this.keycloak.tokenParsed.resource_access) {
      cwrs.push({
        clientId: key,
        roles: this.keycloak.tokenParsed.resource_access[key].roles
      });
    }
    return cwrs;
  }
}
