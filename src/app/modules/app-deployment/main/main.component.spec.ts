import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import { MainComponent } from './main.component';
import {DisplayElementsModule} from '../../display-elements/display-elements.module';
import {AppPermissionsBroker} from '../../../util/app-permissions-broker';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let notifySvc: NotificationService;
  let authSvc: AuthService;
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
    notifySvc = fixture.debugElement.injector.get(NotificationService);
    router = fixture.debugElement.injector.get(Router);
    authSvc = fixture.debugElement.injector.get(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should grant access if user has Read permissions for vendorBroker and appBroker', async(() => {
    let notifySpy = spyOn(notifySvc, 'notify');
    let routerSpy = spyOn(router, 'navigateByUrl');
    let authSpy = spyOn(authSvc, 'observeUserSessionUpdates').and.callThrough();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(notifySpy).toHaveBeenCalledTimes(0);
      expect(routerSpy).toHaveBeenCalledTimes(0);
      expect(authSpy).toHaveBeenCalledTimes(1);
    });
  }));

  it('should deny access, notify, and redirect the user if the Read permission for vendorBroker or appBroker is not applied', async(() => {
    AppPermissionsBroker.prototype.hasPermission = (roleName: string) => {return false;}
    let notifySpy = spyOn(notifySvc, 'notify');
    let routerSpy = spyOn(router, 'navigateByUrl');
    let authSpy = spyOn(authSvc, 'observeUserSessionUpdates').and.callThrough();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(notifySpy).toHaveBeenCalledTimes(1);
      expect(notifySpy).toHaveBeenCalledWith({
        type: NotificationType.Warning,
        message: "You were redirected because you do not have the 'Read' permission"
      });
      expect(routerSpy).toHaveBeenCalledTimes(1);
      expect(routerSpy).toHaveBeenCalledWith('/portal');
      expect(authSpy).toHaveBeenCalledTimes(0);
    });
  }));
});
