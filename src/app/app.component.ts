import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
import {ConfigService} from './services/config.service';
import {GlobalConfig} from './models/global-config.model';
import {AuthService} from './services/auth.service';
import {Subscription} from 'rxjs';
import {LocalStorageService} from './services/local-storage.service';
import {CommonLocalStorageKeys} from './util/constants';

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
    private lsService: LocalStorageService) {}

  ngOnInit() {
    this.fetchConfig();
    this.subscribeToLogin();
  }

  ngOnDestroy() {
    this.loggedInSubject.unsubscribe();
  }

  private fetchConfig(): void {
    this.configSvc.fetchConfig().subscribe(
      (globalConfig: GlobalConfig) => {
        this.injectKeycloakAdapter(globalConfig);
        //this.router.navigateByUrl('/bootstrapper');
      },
      (err) => {
        this.router.navigateByUrl('/bootstrapper');
      }
    );
  }

  private subscribeToLogin(): void {
      this.loggedInSubject = this.authSvc.loggedInSubject.subscribe(
        (loggedIn: boolean) => {
          if (loggedIn) {
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
