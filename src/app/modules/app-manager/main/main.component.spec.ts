import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import { MainComponent } from './main.component';
import {DisplayElementsModule} from '../../display-elements/display-elements.module';
import {AppPermissionsBroker} from '../../../util/app-permissions-broker';
import {AuthService} from '../../../services/auth.service';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {Router} from '@angular/router';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let authSvc: AuthService;
  let notifySvc: NotificationService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        MainComponent 
      ],
      imports: [
        DisplayElementsModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    //Override hasPermission to prevent interfacing with AuthService
    AppPermissionsBroker.prototype.hasPermission = (roleName: string) => {return true;}
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    authSvc = fixture.debugElement.injector.get(AuthService);
    notifySvc = fixture.debugElement.injector.get(NotificationService);
    router = fixture.debugElement.injector.get(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should allow access and subscribe to user session updates', async(() => {
    let authSpy = spyOn(authSvc, 'observeUserSessionUpdates').and.callThrough();
    let notifySpy = spyOn(notifySvc, 'notify');
    let routerSpy = spyOn(router, 'navigateByUrl');
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(authSpy).toHaveBeenCalledTimes(1);
      expect(notifySpy).toHaveBeenCalledTimes(0);
      expect(routerSpy).toHaveBeenCalledTimes(0);
    });
  }));

  it('should deny access and notify and redirect the user', async(() => {
    AppPermissionsBroker.prototype.hasPermission = (roleName: string) => {return false;}
    let authSpy = spyOn(authSvc, 'observeUserSessionUpdates').and.callThrough();
    let notifySpy = spyOn(notifySvc, 'notify');
    let routerSpy = spyOn(router, 'navigateByUrl');
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(authSpy).toHaveBeenCalledTimes(0);
      expect(notifySpy).toHaveBeenCalledTimes(1);
      expect(notifySpy).toHaveBeenCalledWith({
        type: NotificationType.Warning,
        message: "You were redirected because you do not have the 'Read' permission"
      });
      expect(routerSpy).toHaveBeenCalledTimes(1);
      expect(routerSpy).toHaveBeenCalledWith('/portal');
    });
  }));
});
