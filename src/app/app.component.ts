import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
import {ConfigService} from './services/config.service';
import {GlobalConfig} from './models/global-config.model';
import {AuthService} from './services/auth.service';
import {Subscription} from 'rxjs';
import {LocalStorageService} from './services/local-storage.service';
import {CommonLocalStorageKeys} from './util/constants';
import {HttpRequestMonitorService} from './services/http-request-monitor.service';
import {UserSettingsService} from './services/user-settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private loggedInSubject: Subscription;

  constructor(
    private configSvc: ConfigService, 
    private router: Router,
    private authSvc: AuthService,
    private lsService: LocalStorageService,
    private userSettingsSvc: UserSettingsService,
    private monitorSvc: HttpRequestMonitorService) {}

  ngOnInit() {
    this.fetchConfig();
    this.subscribeToLogin();
    this.setShowNavigationSetting();
  }

  ngOnDestroy() {
    this.loggedInSubject.unsubscribe();
  }

  private setShowNavigationSetting(): void {
    if (this.noNavQueryParamExists() || this.checkForIframe()) {
      this.userSettingsSvc.setShowNavigation(false);
      document.body.classList.add('no-nav');
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

  private fetchConfig(): void {
    this.configSvc.fetchConfig().subscribe(
      (globalConfig: GlobalConfig) => {
        this.injectKeycloakAdapter(globalConfig);
      },
      (err) => {
        //TODO show modal indicating that the config was not found
        console.log(err);
      }
    );
  }

  private subscribeToLogin(): void {
      this.loggedInSubject = this.authSvc.observeLoggedInUpdates().subscribe(
        (loggedIn: boolean) => {
          if (loggedIn) {
            this.monitorSvc.start();
            const redirectURI: string = this.lsService.getItem(CommonLocalStorageKeys.RedirectURI);
            if (redirectURI) {
              this.router.navigateByUrl(redirectURI);
            }
            else {
              this.router.navigateByUrl('/portal');
            }
          }
          else {
            this.router.navigateByUrl('/');
          }
        }
      );
  }

  private injectKeycloakAdapter(config: GlobalConfig): void {
    let script = document.createElement('script');
    script.src = config.ssoConnection + 'auth/js/keycloak.js';
    script.type = "text/javascript";
    script.onload = () => {
      this.authSvc.globalConfig = config;
    };
    document.body.appendChild(script);
  }
  
}
