/**
 * @description Root component that triggers SSO login and sets configuration information retrieved from the Configuration Service API.
 * @author Steven M. Redman
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ConfigService } from './services/config.service';
import { GlobalConfig } from './models/global-config.model';
import { AuthService } from './services/auth.service';
import { Subscription, Observable } from 'rxjs';
import { LocalStorageService } from './services/local-storage.service';
import { CommonLocalStorageKeys } from './util/constants';
import { HttpRequestMonitorService } from './services/http-request-monitor.service';
import { UserSettingsService } from './services/user-settings.service';
import { environment as env } from '../environments/environment';
import { SharedRequestsService } from './services/shared-requests.service';
import { QueryParameterCollectorService } from './services/query-parameter-collector.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  showNavigation: boolean;
  private loggedInSubject: Subscription;

  constructor(
    private configSvc: ConfigService,
    private router: Router,
    private authSvc: AuthService,
    private lsService: LocalStorageService,
    private userSettingsSvc: UserSettingsService,
    private activatedRoute: ActivatedRoute,
    private sharedRequestSvc: SharedRequestsService,
    private monitorSvc: HttpRequestMonitorService,
    private qpcSvc: QueryParameterCollectorService
  ) {
    this.showNavigation = true;
    let define = window.customElements.define;
    window.customElements.define = (name: string, constructor: any, options?: ElementDefinitionOptions) => {
      if(!window.customElements.get(name)){
        define(name, constructor, options);
      }
    }
  }

  ngOnInit() {
    // this.fetchConfig();
    const queryParams = new URLSearchParams(window.location.search);
    console.log('queryParams');
    console.log(queryParams);
    queryParams.forEach((value: string, key: string) => {
      console.log(`query param: {${key}, ${value}}`)
      this.sharedRequestSvc.storeQueryParameter(key, value);
      this.qpcSvc.setParameter(key, value);
    });
    this.fetchConfig().subscribe(() => {
      console.log('config fetched');
      this.subscribeToLogin();
      this.setShowNavigationSetting();
    });
  }

  ngOnDestroy() {
    this.loggedInSubject.unsubscribe();
  }

  private setShowNavigationSetting(): void {
    if (this.noNavQueryParamExists() || this.checkForIframe()) {
      this.userSettingsSvc.setShowNavigation(false);
      this.showNavigation = false;
    }
  }

  private noNavQueryParamExists(): boolean {
    return window.location.search.includes("nonav=1");
  }

  private checkForIframe(): boolean {
    try {
      return window.self !== window.top;
    }
    catch (error) {
      return true;
    }
  }

  private fetchConfig(): Observable<void> {
    return new Observable((observer) => {
      this.configSvc.fetchConfig().subscribe(
        (globalConfig: GlobalConfig) => {
          console.log(globalConfig);
          this.injectKeycloakAdapter(globalConfig).subscribe(() => {
            observer.next();
            observer.complete();
          });
        },
        (err) => {
          //TODO show modal indicating that the config was not found
          console.log(err);
          observer.next();
          observer.complete();
        }
      );
    });
  }

  private subscribeToLogin(): void {
  	if (!this.loggedInSubject) {
 		this.loggedInSubject = this.authSvc.observeLoggedInUpdates().subscribe(
  		      (loggedIn: boolean) => {
  		        if (loggedIn) {
  		          //this.monitorSvc.start();
  		          const action = this.qpcSvc.getParameter("action");
  		          const redirectURI: string = this.lsService.getItem(CommonLocalStorageKeys.RedirectURI);
  		          if (this.authSvc.hasRealmRole(this.authSvc.globalConfig.pendingRoleName) || action === "my-registration") {
                  console.log(`portal/my-registration`);
  		            this.router.navigateByUrl('/portal/my-registration');
  		          }
  		          else if (redirectURI) {
                  console.log(`redirectUri: ${redirectURI}`);
  		            this.router.navigateByUrl(redirectURI);
  		          }
  		          else {
                  console.log(`portal`);
  		            this.router.navigateByUrl('/portal');
  		          }
  		        }
  		        else {
                console.log(`else`);
  		          this.router.navigateByUrl('/');
  		        }
  		      }
  		); 		
  	}
  }

  private injectKeycloakAdapter(config: GlobalConfig): Observable<void> {
    return new Observable((observer) => {
      this.authSvc.forceLogin = window.location.search.includes("forcelogin=1");
      if (!env.testing) {
        let script = document.createElement('script');
        script.id = "keycloak-client-script";
        script.src = config.ssoConnection + 'auth/js/keycloak.js';
        script.type = "text/javascript";
        script.onload = () => {
          console.log('adapter onload');
          this.authSvc.globalConfig = config;
          observer.next();
          observer.complete();
        };
        document.body.appendChild(script);
      }
      //When testing, onload will never be called. Added this condition to set the config for tests.
      else {
        this.authSvc.globalConfig = config;
      }
    });
  }

}
