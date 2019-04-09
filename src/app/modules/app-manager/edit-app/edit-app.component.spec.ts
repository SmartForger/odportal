import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';

import { EditAppComponent } from './edit-app.component';
import {MatMenuModule, MatMenu} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {AppInfoModule} from '../../app-info/app-info.module';
import {MatTabsModule} from '@angular/material/tabs';
import {RoleMapperComponent} from '../role-mapper/role-mapper.component';
import {MatChipsModule} from '@angular/material/chips';
import {AppPermissionsBroker} from '../../../util/app-permissions-broker';
import {App} from '../../../models/app.model';
import {AppsService} from '../../../services/apps.service';
import { Observable } from 'rxjs';
import {AuthService} from '../../../services/auth.service';
import {DescriptorComponent} from '../../app-info/descriptor/descriptor.component';
import {WidgetsComponent} from '../../app-info/widgets/widgets.component';
import {ClientRolesComponent} from '../../app-info/client-roles/client-roles.component';
import {CommentsComponent} from '../../app-info/comments/comments.component';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';

fdescribe('EditAppComponent', () => {
  let component: EditAppComponent;
  let fixture: ComponentFixture<EditAppComponent>;
  let appsSvc: AppsService;
  let authSvc: AuthService;
  let crumbsSvc: BreadcrumbsService;

  let fakeApp: App;

  fakeApp = {
    docId: "fake-app-id",
    appTitle: "Fake App",
    enabled: true,
    native: false,
    clientId: "fake-client-id",
    clientName: "fake-client",
    externalPermissions: [],
    apiCalls: []
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        EditAppComponent,
        RoleMapperComponent
      ],
      imports: [
        MatMenuModule,
        MatIconModule,
        RouterTestingModule,
        MatGridListModule,
        AppInfoModule,
        MatTabsModule,
        MatChipsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    //Override hasPermission to prevent interfacing with AuthService
    AppPermissionsBroker.prototype.hasPermission = (roleName: string) => {return true;}
    //Stub ngOnInit methods for child component to isolate async zone
    DescriptorComponent.prototype.ngOnInit = () => {};
    RoleMapperComponent.prototype.ngOnInit = () => {};
    WidgetsComponent.prototype.ngOnInit = () => {};
    ClientRolesComponent.prototype.ngOnInit = () => {};
    CommentsComponent.prototype.ngOnInit = () => {};
    fixture = TestBed.createComponent(EditAppComponent);
    component = fixture.componentInstance;
    appsSvc = fixture.debugElement.injector.get(AppsService);
    authSvc = fixture.debugElement.injector.get(AuthService);
    crumbsSvc = fixture.debugElement.injector.get(BreadcrumbsService);
    fakeApp = {
      docId: "fake-app-id",
      appTitle: "Fake App",
      enabled: true,
      native: false,
      clientId: "fake-client-id",
      clientName: "fake-client",
      externalPermissions: [],
      apiCalls: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch the app, subscribe to user session updates, and generate breadcrumbs', async(() => {
    let appsSpy = spyOn(appsSvc, 'fetch').and.returnValue(new Observable(observer => {
      observer.next(fakeApp);
      observer.complete();
    }));
    let authSpy = spyOn(authSvc, 'observeUserSessionUpdates').and.callThrough();
    let crumbsSpy = spyOn(crumbsSvc, 'update');
    component.ngOnInit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(appsSpy).toHaveBeenCalledTimes(1);
      expect(authSpy).toHaveBeenCalledTimes(1);
      expect(component.app).toEqual(fakeApp);
      expect(crumbsSpy).toHaveBeenCalledTimes(1);
      expect(crumbsSpy).toHaveBeenCalledWith(new Array<Breadcrumb>(
        {
          title: "Dashboard",
          active: false,
          link: '/portal'
        },
        {
          title: "MicroApp Manager",
          active: false,
          link: '/portal/app-manager'
        },
        {
          title: `${fakeApp.appTitle} Details`,
          active: true,
          link: null
        }
      ));
    }); 
  }));

  it('should not display the controls context menu is app is not set', () => {
    let menuBtn = fixture.debugElement.query(By.css('.ml-2'));
    expect(menuBtn).toBeNull();
    component.app = fakeApp;
    fixture.detectChanges();
    menuBtn = fixture.debugElement.query(By.css('.ml-2'));
    expect(menuBtn).toBeTruthy();
  });

  it('should not display the controls context menu is the user does not have Update or Delete permissions', () => {
    component.app = fakeApp;
    component.canDelete = false;
    component.canUpdate = false;
    fixture.detectChanges();
    let menuBtn = fixture.debugElement.query(By.css('.ml-2'));
    expect(menuBtn).toBeNull();
    component.canUpdate = true;
    fixture.detectChanges();
    menuBtn = fixture.debugElement.query(By.css('.ml-2'));
    expect(menuBtn).toBeTruthy();
    component.canUpdate = false;
    component.canDelete = true;
    fixture.detectChanges();
    menuBtn = fixture.debugElement.query(By.css('.ml-2'));
    expect(menuBtn).toBeTruthy();
  });

  it('should show the Approve option if the app is not approved, not native, and the user has the Update permission', async(() => {
    component.app = fakeApp;
    component.app.approved = false;
    component.app.native = false;
    component.canUpdate = false;
    fixture.detectChanges();
    let menuBtn = fixture.debugElement.query(By.css('.ml-2'));
    menuBtn.triggerEventHandler('click', null);
    fixture.whenStable().then(() => {
      let approveBtn = fixture.debugElement.query(By.css('.test-approve-btn'));
      expect(approveBtn).toBeNull();
      component.canUpdate = true;
      fixture.detectChanges();
      approveBtn = fixture.debugElement.query(By.css('.test-approve-btn'));
      expect(approveBtn).toBeTruthy();
      component.app.approved = true;
      fixture.detectChanges();
      approveBtn = fixture.debugElement.query(By.css('.test-approve-btn'));
      expect(approveBtn).toBeNull();
      component.app.approved = false;
      component.app.native = true;
      fixture.detectChanges();
      approveBtn = fixture.debugElement.query(By.css('.test-approve-btn'));
      expect(approveBtn).toBeNull();
    });
  }));

  it('should show the Test option if the the app is not native', async(() => {
    component.app = fakeApp;
    component.app.native = true;
    component.canUpdate = true;
    fixture.detectChanges();
    let menuBtn = fixture.debugElement.query(By.css('.ml-2'));
    menuBtn.triggerEventHandler('click', null);
    fixture.whenStable().then(() => {
      let testBtn = fixture.debugElement.query(By.css('.test-test-btn'));
      expect(testBtn).toBeNull();
      component.app.native = false;
      fixture.detectChanges();
      testBtn = fixture.debugElement.query(By.css('.test-test-btn'));
      expect(testBtn).toBeTruthy();
    });
  }));

  it('should show the Enable/Disable option if the app is approved or the app is native, the user has the Update permission, and the app is disabled/enabled', async(() => {
    component.app = fakeApp;
    component.app.approved = false;
    component.app.native = false;
    component.app.enabled = false;
    component.canUpdate = true;
    fixture.detectChanges();
    let menuBtn = fixture.debugElement.query(By.css('.ml-2'));
    menuBtn.triggerEventHandler('click', null);
    fixture.whenStable().then(() => {
      let enableBtn = fixture.debugElement.query(By.css('.test-enable-btn'));
      let disableBtn = fixture.debugElement.query(By.css('.test-disable-btn'));
      expect(enableBtn).toBeNull();
      expect(disableBtn).toBeNull();
      component.app.approved = true;
      fixture.detectChanges();
      enableBtn = fixture.debugElement.query(By.css('.test-enable-btn'));
      disableBtn = fixture.debugElement.query(By.css('.test-disable-btn'));
      expect(enableBtn).toBeTruthy();
      expect(disableBtn).toBeNull();
      component.app.approved = false;
      component.app.native = true;
      fixture.detectChanges();
      enableBtn = fixture.debugElement.query(By.css('.test-enable-btn'));
      disableBtn = fixture.debugElement.query(By.css('.test-disable-btn'));
      expect(enableBtn).toBeTruthy();
      expect(disableBtn).toBeNull();
      component.app.enabled = true;
      fixture.detectChanges();
      enableBtn = fixture.debugElement.query(By.css('.test-enable-btn'));
      disableBtn = fixture.debugElement.query(By.css('.test-disable-btn'));
      expect(enableBtn).toBeNull();
      expect(disableBtn).toBeTruthy();
    });
  }));

  it('should show the Assign/Remove Trusted option if the app is approved, not native, and the user has the Update permission', async(() => {
    component.app = fakeApp;
    component.app.approved = false;
    component.app.native = true;
    component.app.trusted = false;
    component.canUpdate = true;
    fixture.detectChanges();
    let menuBtn = fixture.debugElement.query(By.css('.ml-2'));
    menuBtn.triggerEventHandler('click', null);
    fixture.whenStable().then(() => {
      let trustedBtn = fixture.debugElement.query(By.css('.test-trusted-btn'));
      let rmTrustedBtn = fixture.debugElement.query(By.css('.test-rmv-trusted-btn'));
      expect(trustedBtn).toBeNull();
      expect(rmTrustedBtn).toBeNull();
      component.app.approved = true;
      fixture.detectChanges();
      trustedBtn = fixture.debugElement.query(By.css('.test-trusted-btn'));
      rmTrustedBtn = fixture.debugElement.query(By.css('.test-rmv-trusted-btn'));
      expect(trustedBtn).toBeNull();
      expect(rmTrustedBtn).toBeNull();
      component.app.native = false;
      fixture.detectChanges();
      trustedBtn = fixture.debugElement.query(By.css('.test-trusted-btn'));
      rmTrustedBtn = fixture.debugElement.query(By.css('.test-rmv-trusted-btn'));
      expect(trustedBtn).toBeTruthy();
      expect(rmTrustedBtn).toBeNull();
      component.app.trusted = true;
      fixture.detectChanges();
      trustedBtn = fixture.debugElement.query(By.css('.test-trusted-btn'));
      rmTrustedBtn = fixture.debugElement.query(By.css('.test-rmv-trusted-btn'));
      expect(trustedBtn).toBeNull();
      expect(rmTrustedBtn).toBeTruthy();
    });
  }));

  it('should show the Delete option if the app is not native and the has the Delete permission', async(() => {
    component.app = fakeApp;
    component.canDelete = false;
    component.app.native = true;
    fixture.detectChanges();
    let menuBtn = fixture.debugElement.query(By.css('.ml-2'));
    menuBtn.triggerEventHandler('click', null);
    fixture.whenStable().then(() => {
      let deleteBtn = fixture.debugElement.query(By.css('.test-delete-btn'));
      expect(deleteBtn).toBeNull();
      component.canDelete = true;
      fixture.detectChanges();
      deleteBtn = fixture.debugElement.query(By.css('.test-delete-btn'));
      expect(deleteBtn).toBeNull();
      component.app.native = false;
      fixture.detectChanges();
      deleteBtn = fixture.debugElement.query(By.css('.test-delete-btn'));
      expect(deleteBtn).toBeTruthy();
    });
  }));
  
});
