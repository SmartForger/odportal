import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { EditAppComponent } from './edit-app.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { AppInfoModule } from '../../app-info/app-info.module';
import { MatTabsModule } from '@angular/material/tabs';
import { RoleMapperComponent } from '../role-mapper/role-mapper.component';
import { MatChipsModule } from '@angular/material/chips';
import { AppPermissionsBroker } from '../../../util/app-permissions-broker';
import { App } from '../../../models/app.model';
import { AppsService } from '../../../services/apps.service';
import { Observable, Subject, throwError } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { DescriptorComponent } from '../../app-info/descriptor/descriptor.component';
import { WidgetsComponent } from '../../app-info/widgets/widgets.component';
import { ClientRolesComponent } from '../../app-info/client-roles/client-roles.component';
import { CommentsComponent } from '../../app-info/comments/comments.component';
import { BreadcrumbsService } from '../../display-elements/breadcrumbs.service';
import { Breadcrumb } from '../../display-elements/breadcrumb.model';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../notifier/notification.service';
import { NotificationType } from '../../../notifier/notificiation.model';
import { Router } from '@angular/router';

class MatDialogRef {
  componentInstance: any = {
    title: '',
    message: '',
    icons: [],
    buttons: [],
    btnClick: new Subject<string>()
  };
  close(): void { }
}

class MatDialogMock {
  mdr: MatDialogRef;

  open() {
    return this.mdr;
  }
}

describe('EditAppComponent', () => {
  let component: EditAppComponent;
  let fixture: ComponentFixture<EditAppComponent>;
  let appsSvc: AppsService;
  let authSvc: AuthService;
  let crumbsSvc: BreadcrumbsService;
  let fakeApp: App;
  let dialog: MatDialogMock;
  let notifySvc: NotificationService;
  let router: Router;

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
      ],
      providers: [
        {
          provide: MatDialog, useClass: MatDialogMock
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    //Override hasPermission to prevent interfacing with AuthService
    AppPermissionsBroker.prototype.hasPermission = (roleName: string) => { return true; }
    //Stub ngOnInit methods for child component to isolate async zone
    DescriptorComponent.prototype.ngOnInit = () => { };
    RoleMapperComponent.prototype.ngOnInit = () => { };
    WidgetsComponent.prototype.ngOnInit = () => { };
    ClientRolesComponent.prototype.ngOnInit = () => { };
    CommentsComponent.prototype.ngOnInit = () => { };
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
    dialog = TestBed.get(MatDialog);
    dialog.mdr = new MatDialogRef();
    notifySvc = fixture.debugElement.injector.get(NotificationService);
    router = fixture.debugElement.injector.get(Router);
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

  it('should approve the app', async(() => {
    component.app = fakeApp;
    component.canUpdate = true;
    component.app.approved = false;
    component.app.native = false;
    let dialogOpenSpy = spyOn(dialog, 'open').and.callThrough();
    let dialogCloseSpy = spyOn(dialog.mdr, 'close').and.callThrough();
    let appsSpy = spyOn(appsSvc, 'update').and.returnValue(new Observable(observer => {
      observer.next(fakeApp);
      observer.complete();
    }));
    let appUpdatedSpy = spyOn(appsSvc, 'appUpdated');
    let notifySpy = spyOn(notifySvc, 'notify');
    fixture.detectChanges();
    let menuBtn = fixture.debugElement.query(By.css('.ml-2'));
    menuBtn.triggerEventHandler('click', null);
    fixture.whenStable().then(() => {
      let approveBtn = fixture.debugElement.query(By.css('.test-approve-btn'));
      approveBtn.triggerEventHandler('click', null);
      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(dialog.mdr.componentInstance.title).toBe("Approve App");
      expect(dialog.mdr.componentInstance.message).toBe("Are you sure you want to approve this Microapp and make it available to all users based on the configured role mappings?");
      expect(dialog.mdr.componentInstance.icons).toEqual([{ icon: 'done_outline', classList: '' }]);
      expect(dialog.mdr.componentInstance.buttons).toEqual([{ title: 'Approve', classList: 'bg-green' }]);
      dialog.mdr.componentInstance.btnClick.next('Approve');
      expect(appsSpy).toHaveBeenCalledTimes(1);
      expect(component.app.approved).toBe(true);
      expect(dialogCloseSpy).toHaveBeenCalledTimes(1);
      expect(appUpdatedSpy).toHaveBeenCalledTimes(1);
      expect(notifySpy).toHaveBeenCalledTimes(1);
      expect(notifySpy).toHaveBeenCalledWith({
        type: NotificationType.Success,
        message: `${fakeApp.appTitle} was successfully approved`
      });
    });
  }));

  it('should show an error notification if approving fails', async(() => {
    component.app = fakeApp;
    component.app.approved = false;
    let appsSpy = spyOn(appsSvc, 'update').and.returnValue(throwError(new Error("Error msg")));
    let appUpdatedSpy = spyOn(appsSvc, 'appUpdated');
    let notifySpy = spyOn(notifySvc, 'notify');
    component.approveApp();
    dialog.mdr.componentInstance.btnClick.next('Approve');
    expect(appsSpy).toHaveBeenCalledTimes(1);
    expect(appUpdatedSpy).toHaveBeenCalledTimes(0);
    expect(notifySpy).toHaveBeenCalledTimes(1);
    expect(notifySpy).toHaveBeenCalledWith({
      type: NotificationType.Error,
      message: `There was a problem while approving ${fakeApp.appTitle}`
    });
  }));

  it('should enable the app', async(() => {
    component.app = fakeApp;
    component.canUpdate = true;
    component.app.enabled = false;
    component.app.approved = true;
    let appsSpy = spyOn(appsSvc, 'update').and.returnValue(new Observable(observer => {
      observer.next(fakeApp);
      observer.complete();
    }));
    let appUpdatedSpy = spyOn(appsSvc, 'appUpdated');
    let notifySpy = spyOn(notifySvc, 'notify');
    let dialogOpenSpy = spyOn(dialog, 'open').and.callThrough();
    let dialogCloseSpy = spyOn(dialog.mdr, 'close').and.callThrough();
    fixture.detectChanges();
    let menuBtn = fixture.debugElement.query(By.css('.ml-2'));
    menuBtn.triggerEventHandler('click', null);
    fixture.whenStable().then(() => {
      let enableBtn = fixture.debugElement.query(By.css('.test-enable-btn'));
      enableBtn.triggerEventHandler('click', null);
      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(dialog.mdr.componentInstance.title).toBe("Enable App");
      expect(dialog.mdr.componentInstance.message).toBe("Are you sure you want to enable this Microapp and permit user access?");
      expect(dialog.mdr.componentInstance.icons).toEqual([{ icon: 'done_outline', classList: '' }]);
      expect(dialog.mdr.componentInstance.buttons).toEqual([{ title: 'Enable', classList: 'bg-green' }]);
      dialog.mdr.componentInstance.btnClick.next('Enable');
      expect(appsSpy).toHaveBeenCalledTimes(1);
      expect(component.app.enabled).toBe(true);
      expect(dialogCloseSpy).toHaveBeenCalledTimes(1);
      expect(appUpdatedSpy).toHaveBeenCalledTimes(1);
      expect(notifySpy).toHaveBeenCalledTimes(1);
      expect(notifySpy).toHaveBeenCalledWith({
        type: NotificationType.Success,
        message: `${fakeApp.appTitle} was enabled successfully`
      });
    });
  }));

  it('should show an error notification if enabling the app fails', async(() => {
    component.app = fakeApp;
    component.app.enabled = false;
    let appsSpy = spyOn(appsSvc, 'update').and.returnValue(throwError(new Error("Error msg")));
    let appUpdatedSpy = spyOn(appsSvc, 'appUpdated');
    let notifySpy = spyOn(notifySvc, 'notify');
    component.enableButtonClicked();
    dialog.mdr.componentInstance.btnClick.next('Enable');
    expect(appsSpy).toHaveBeenCalledTimes(1);
    expect(appUpdatedSpy).toHaveBeenCalledTimes(0);
    expect(notifySpy).toHaveBeenCalledTimes(1);
    expect(notifySpy).toHaveBeenCalledWith({
      type: NotificationType.Error,
      message: `There was a problem while enabling ${fakeApp.appTitle}`
    });
  }));

  it('should disable the app', async(() => {
    component.app = fakeApp;
    component.canUpdate = true;
    component.app.enabled = true;
    component.app.approved = true;
    let appsSpy = spyOn(appsSvc, 'update').and.returnValue(new Observable(observer => {
      observer.next(fakeApp);
      observer.complete();
    }));
    let appUpdatedSpy = spyOn(appsSvc, 'appUpdated');
    let notifySpy = spyOn(notifySvc, 'notify');
    let dialogOpenSpy = spyOn(dialog, 'open').and.callThrough();
    let dialogCloseSpy = spyOn(dialog.mdr, 'close').and.callThrough();
    fixture.detectChanges();
    let menuBtn = fixture.debugElement.query(By.css('.ml-2'));
    menuBtn.triggerEventHandler('click', null);
    fixture.whenStable().then(() => {
      let disableBtn = fixture.debugElement.query(By.css('.test-disable-btn'));
      disableBtn.triggerEventHandler('click', null);
      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(dialog.mdr.componentInstance.title).toBe("Disable App");
      expect(dialog.mdr.componentInstance.message).toBe("Are you sure you want to disable this Microapp and deny user access?");
      expect(dialog.mdr.componentInstance.icons).toEqual([{ icon: 'lock', classList: '' }]);
      expect(dialog.mdr.componentInstance.buttons).toEqual([{ title: 'Disable', classList: 'bg-red' }]);
      dialog.mdr.componentInstance.btnClick.next('Disable');
      expect(appsSpy).toHaveBeenCalledTimes(1);
      expect(component.app.enabled).toBe(false);
      expect(dialogCloseSpy).toHaveBeenCalledTimes(1);
      expect(appUpdatedSpy).toHaveBeenCalledTimes(1);
      expect(notifySpy).toHaveBeenCalledTimes(1);
      expect(notifySpy).toHaveBeenCalledWith({
        type: NotificationType.Success,
        message: `${fakeApp.appTitle} was disabled successfully`
      });
    });
  }));

  it('should show an error notification if the disabling the app fails', async(() => {
    component.app = fakeApp;
    component.app.enabled = true;
    let appsSpy = spyOn(appsSvc, 'update').and.returnValue(throwError(new Error("Error msg")));
    let appUpdatedSpy = spyOn(appsSvc, 'appUpdated');
    let notifySpy = spyOn(notifySvc, 'notify');
    component.disableButtonClicked();
    dialog.mdr.componentInstance.btnClick.next('Disable');
    expect(appsSpy).toHaveBeenCalledTimes(1);
    expect(appUpdatedSpy).toHaveBeenCalledTimes(0);
    expect(notifySpy).toHaveBeenCalledTimes(1);
    expect(notifySpy).toHaveBeenCalledWith({
      type: NotificationType.Error,
      message: `There was a problem while disabling ${fakeApp.appTitle}`
    });
  }));

  it('should enable Trusted mode for the app', async(() => {
    component.app = fakeApp;
    component.canUpdate = true;
    component.app.trusted = false;
    component.app.approved = true;
    component.app.native = false;
    let dialogOpenSpy = spyOn(dialog, 'open').and.callThrough();
    let dialogCloseSpy = spyOn(dialog.mdr, 'close').and.callThrough();
    let appsSpy = spyOn(appsSvc, 'update').and.returnValue(new Observable(observer => {
      observer.next(fakeApp);
      observer.complete();
    }));
    let appUpdatedSpy = spyOn(appsSvc, 'appUpdated');
    let notifySpy = spyOn(notifySvc, 'notify');
    fixture.detectChanges();
    let menuBtn = fixture.debugElement.query(By.css('.ml-2'));
    menuBtn.triggerEventHandler('click', null);
    fixture.whenStable().then(() => {
      let trustedBtn = fixture.debugElement.query(By.css('.test-trusted-btn'));
      trustedBtn.triggerEventHandler('click', null);
      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(dialog.mdr.componentInstance.title).toBe("Enable Trusted mode");
      expect(dialog.mdr.componentInstance.message).toBe("Are you sure you want to enable Trusted mode and allow this app to manage core service data?");
      expect(dialog.mdr.componentInstance.icons).toEqual([{ icon: '', classList: '' }]);
      expect(dialog.mdr.componentInstance.buttons).toEqual([{ title: 'Confirm', classList: 'btn btn-add btn-success' }]);
      dialog.mdr.componentInstance.btnClick.next('Confirm');
      expect(appsSpy).toHaveBeenCalledTimes(1);
      expect(component.app.trusted).toBe(true);
      expect(dialogCloseSpy).toHaveBeenCalledTimes(1);
      expect(appUpdatedSpy).toHaveBeenCalledTimes(1);
      expect(notifySpy).toHaveBeenCalledTimes(1);
      expect(notifySpy).toHaveBeenCalledWith({
        type: NotificationType.Success,
        message: `Trusted mode for ${fakeApp.appTitle} was enabled successfully`
      });
    });
  }));

  it('should show an error notification if enabling Trusted mode fails', async(() => {
    component.app = fakeApp;
    component.app.trusted = false;
    let appsSpy = spyOn(appsSvc, 'update').and.returnValue(throwError(new Error("Error msg")));
    let appUpdatedSpy = spyOn(appsSvc, 'appUpdated');
    let notifySpy = spyOn(notifySvc, 'notify');
    component.enableTrusted();
    dialog.mdr.componentInstance.btnClick.next('Confirm');
    expect(appsSpy).toHaveBeenCalledTimes(1);
    expect(appUpdatedSpy).toHaveBeenCalledTimes(0);
    expect(notifySpy).toHaveBeenCalledTimes(1);
    expect(notifySpy).toHaveBeenCalledWith({
      type: NotificationType.Error,
      message: `There was a problem while enabling Trusted mode for ${fakeApp.appTitle}`
    });
  }));

  it('should disable Trusted mode for the app', async(() => {
    component.app = fakeApp;
    component.canUpdate = true;
    component.app.trusted = true;
    component.app.approved = true;
    component.app.native = false;
    let dialogOpenSpy = spyOn(dialog, 'open').and.callThrough();
    let dialogCloseSpy = spyOn(dialog.mdr, 'close').and.callThrough();
    let appsSpy = spyOn(appsSvc, 'update').and.returnValue(new Observable(observer => {
      observer.next(fakeApp);
      observer.complete();
    }));
    let appUpdatedSpy = spyOn(appsSvc, 'appUpdated');
    let notifySpy = spyOn(notifySvc, 'notify');
    fixture.detectChanges();
    let menuBtn = fixture.debugElement.query(By.css('.ml-2'));
    menuBtn.triggerEventHandler('click', null);
    fixture.whenStable().then(() => {
      let rmTrustedBtn = fixture.debugElement.query(By.css('.test-rmv-trusted-btn'));
      rmTrustedBtn.triggerEventHandler('click', null);
      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(dialog.mdr.componentInstance.title).toBe("Disable Trusted mode");
      expect(dialog.mdr.componentInstance.message).toBe("Are you sure you want to disable Trusted mode and prevent this app from managing core service data?");
      expect(dialog.mdr.componentInstance.icons).toEqual([{ icon: '', classList: '' }]);
      expect(dialog.mdr.componentInstance.buttons).toEqual([{ title: 'Confirm', classList: 'btn btn-add btn-success' }]);
      dialog.mdr.componentInstance.btnClick.next('Confirm');
      expect(appsSpy).toHaveBeenCalledTimes(1);
      expect(component.app.trusted).toBe(false);
      expect(dialogCloseSpy).toHaveBeenCalledTimes(1);
      expect(appUpdatedSpy).toHaveBeenCalledTimes(1);
      expect(notifySpy).toHaveBeenCalledTimes(1);
      expect(notifySpy).toHaveBeenCalledWith({
        type: NotificationType.Success,
        message: `Trusted mode for ${fakeApp.appTitle} was disabled successfully`
      });
    });
  }));

  it('should show an error notification if disabling Trusted mode fails', async(() => {
    component.app = fakeApp;
    component.app.trusted = true;
    let appsSpy = spyOn(appsSvc, 'update').and.returnValue(throwError(new Error("Error msg")));
    let appUpdatedSpy = spyOn(appsSvc, 'appUpdated');
    let notifySpy = spyOn(notifySvc, 'notify');
    component.disableTrusted();
    dialog.mdr.componentInstance.btnClick.next('Confirm');
    expect(appsSpy).toHaveBeenCalledTimes(1);
    expect(appUpdatedSpy).toHaveBeenCalledTimes(0);
    expect(notifySpy).toHaveBeenCalledTimes(1);
    expect(notifySpy).toHaveBeenCalledWith({
      type: NotificationType.Error,
      message: `There was a problem while disabling Trusted mode for ${fakeApp.appTitle}`
    });
  }));

  it('should delete the app, display a notification, and redirect the user', async(() => {
    component.app = fakeApp;
    component.canDelete = true;
    component.app.native = false;
    let appsSpy = spyOn(appsSvc, 'delete').and.returnValue(new Observable(observer => {
      observer.next(fakeApp);
      observer.complete();
    }));
    let appUpdatedSpy = spyOn(appsSvc, 'appUpdated');
    let notifySpy = spyOn(notifySvc, 'notify');
    let dialogOpenSpy = spyOn(dialog, 'open').and.callThrough();
    let dialogCloseSpy = spyOn(dialog.mdr, 'close').and.callThrough();
    let routerSpy = spyOn(router, 'navigateByUrl');
    fixture.detectChanges();
    let menuBtn = fixture.debugElement.query(By.css('.ml-2'));
    menuBtn.triggerEventHandler('click', null);
    fixture.whenStable().then(() => {
      let deleteBtn = fixture.debugElement.query(By.css('.test-delete-btn'));
      deleteBtn.triggerEventHandler('click', null);
      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(dialog.mdr.componentInstance.title).toBe("Delete Microapp");
      expect(dialog.mdr.componentInstance.message).toBe("Are you sure you want to permanently delete this Microapp?");
      expect(dialog.mdr.componentInstance.icons).toEqual([{ icon: 'delete_forever', classList: '' }]);
      expect(dialog.mdr.componentInstance.buttons).toEqual([{ title: 'Delete', classList: 'bg-red' }]);
      dialog.mdr.componentInstance.btnClick.next('Delete');
      expect(appsSpy).toHaveBeenCalledTimes(1);
      expect(dialogCloseSpy).toHaveBeenCalledTimes(1);
      expect(appUpdatedSpy).toHaveBeenCalledTimes(1);
      expect(notifySpy).toHaveBeenCalledTimes(1);
      expect(notifySpy).toHaveBeenCalledWith({
        type: NotificationType.Success,
        message: `${fakeApp.appTitle} was deleted successfully`
      });
      expect(routerSpy).toHaveBeenCalledTimes(1);
      expect(routerSpy).toHaveBeenCalledWith('/portal/app-manager');
    });
  }));

  it('should display an error notification if deleting the app fails', async(() => {
    component.app = fakeApp;
    let appsSpy = spyOn(appsSvc, 'delete').and.returnValue(throwError(new Error("Error msg")));
    let appUpdatedSpy = spyOn(appsSvc, 'appUpdated');
    let notifySpy = spyOn(notifySvc, 'notify');
    let routerSpy = spyOn(router, 'navigateByUrl');
    component.removeApp();
    dialog.mdr.componentInstance.btnClick.next('Delete');
    expect(appsSpy).toHaveBeenCalledTimes(1);
    expect(appUpdatedSpy).toHaveBeenCalledTimes(0);
    expect(notifySpy).toHaveBeenCalledTimes(1);
    expect(notifySpy).toHaveBeenCalledWith({
      type: NotificationType.Error,
      message: `There was a problem while deleting ${fakeApp.appTitle}`
    });
    expect(routerSpy).toHaveBeenCalledTimes(0);
  }));

});
