import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NotifierModule } from 'angular-notifier';
import {Router} from '@angular/router';

import { AppComponent } from './app.component';
import { LoadingComponent } from './loading/loading.component';
import { AjaxProgressComponent } from './ajax-progress/ajax-progress.component';
import { NotifierComponent } from './notifier/notifier.component';
import { ConfigService } from './services/config.service';
import { Observable, throwError } from 'rxjs';
import {AuthService} from './services/auth.service';
import {GlobalConfig} from './models/global-config.model';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let configSvc: ConfigService;
  let authSvc: AuthService;
  let router: Router;

  const mockConfig: GlobalConfig = {
    ssoConnection: "https://mock-sso/",
    realm: "mock-realm"
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        NotifierModule
      ],
      declarations: [
        AppComponent,
        LoadingComponent,
        AjaxProgressComponent,
        NotifierComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
    configSvc = fixture.debugElement.injector.get(ConfigService);
    authSvc = fixture.debugElement.injector.get(AuthService);
    router = fixture.debugElement.injector.get(Router);
  }));

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch the config document and log in successfully', async(() => {
    let configSpy = spyOn(configSvc, 'fetchConfig').and.returnValue(new Observable(observer => {
      observer.next(mockConfig);
      observer.complete();
    }));
    let loggedInSpy = spyOn(authSvc, 'observeLoggedInUpdates').and.callThrough();
    let routerSpy = spyOn(router, 'navigateByUrl');
    component.ngOnInit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(configSpy).toHaveBeenCalled();
      expect(authSvc.globalConfig == mockConfig).toBe(true);
      expect(loggedInSpy).toHaveBeenCalled();
      expect(authSvc.isLoggedIn).toBe(true);
      expect(routerSpy).toHaveBeenCalledWith('/portal');
    });
  }));

  it('should fail to fetch the config document and not login successfully', async(() => {
    let configSpy = spyOn(configSvc, 'fetchConfig').and.callFake(() => {
      return throwError("Error");
    });
    let routerSpy = spyOn(router, 'navigateByUrl');
    let loggedInSpy = spyOn(authSvc, 'observeLoggedInUpdates').and.callThrough();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(configSpy).toHaveBeenCalled();
      expect(authSvc.globalConfig == mockConfig).toBe(false);
      expect(loggedInSpy).toHaveBeenCalled();
      expect(authSvc.isLoggedIn).toBe(false);
      expect(routerSpy).toHaveBeenCalledTimes(0);
    });
  }));

});
