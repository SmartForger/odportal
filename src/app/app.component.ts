import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
import {ConfigService} from './services/config.service';
import {GlobalConfig} from './models/global-config.model';
import {AuthService} from './services/auth.service';
import {Subscription} from 'rxjs';

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
    private authSvc: AuthService) {

  }

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
            this.router.navigateByUrl('/portal');
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
