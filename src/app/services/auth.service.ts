import { Injectable } from '@angular/core';
import {GlobalConfig} from '../models/global-config.model';
import {Subject} from 'rxjs';

declare var Keycloak: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedInSubject: Subject<boolean>;

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
  }

  private initKeycloak(): void {
    this.keycloak = Keycloak({
      url: this.globalConfig.ssoConnection + 'auth',
      realm: this.globalConfig.realm,
      clientId: this.globalConfig.publicClientId
    })
    .init({onLoad: 'login-required'})
    .success((authenticated) => {
      this.loggedInSubject.next(true);
    });
  }
}
