import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { EditAppMainComponent } from './edit-app-main.component';
import { AppInfoModule } from '../../app-info/app-info.module';
import { MatTabsModule } from '@angular/material/tabs';
import { EditAppRoleMappingsComponent } from '../edit-app-role-mappings/edit-app-role-mappings.component';
import { WidgetsComponent } from '../../app-info/widgets/widgets.component';
import { ClientRolesComponent } from '../../app-info/client-roles/client-roles.component';
import { CommentsComponent } from '../../app-info/comments/comments.component';
import { DescriptorComponent } from '../../app-info/descriptor/descriptor.component';
import { MatChipsModule } from '@angular/material/chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VendorsService } from '../../../services/vendors.service';
import { AppsService } from '../../../services/apps.service';
import { Vendor } from '../../../models/vendor.model';
import { App } from '../../../models/app.model';
import {Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';

class MockComponent {

}

describe('EditAppMainComponent', () => {
  let component: EditAppMainComponent;
  let fixture: ComponentFixture<EditAppMainComponent>;
  let vendorsSvc: VendorsService;
  let appsSvc: AppsService;

  const fakeVendor: Vendor = {
    docId: "fake-vendor-id",
    name: "Fake Vendor",
    pocPhone: "555-555-5555",
    pocEmail: "fvendor@test.com"
  };

  const fakeApp: App = {
    docId: "fake-app-id",
    appTitle: "Fake App",
    enabled: true,
    native: false,
    clientId: "fake-client-id",
    clientName: "fake-client-name"
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditAppMainComponent,
        EditAppRoleMappingsComponent
      ],
      imports: [
        AppInfoModule,
        MatTabsModule,
        MatChipsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {
            path: 'portal/app-deployment',
            component: MockComponent
          }
        ]),
        BrowserAnimationsModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppMainComponent);
    component = fixture.componentInstance;
    vendorsSvc = fixture.debugElement.injector.get(VendorsService);
    appsSvc = fixture.debugElement.injector.get(AppsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display the app title or render components if app and vendor are not set', async(() => {
    let vendorSpy = spyOn(vendorsSvc, 'fetchByUserAndVendorId').and.returnValue(throwError(new Error("Error msg")));
    let appSpy = spyOn(appsSvc, 'fetchVendorApp');
    let descSpy = spyOn(DescriptorComponent.prototype, 'ngOnInit');
    let widgetsSpy = spyOn(WidgetsComponent.prototype, 'ngOnInit');
    let clientRolesSpy = spyOn(ClientRolesComponent.prototype, 'ngOnInit');
    let roleMappingsSpy = spyOn(EditAppRoleMappingsComponent.prototype, 'ngOnInit');
    let commentsSpy = spyOn(CommentsComponent.prototype, 'ngOnInit');
    component.ngOnInit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(vendorSpy).toHaveBeenCalledTimes(1);
      expect(appSpy).toHaveBeenCalledTimes(0);
      expect(component.app).toBeUndefined();
      expect(component.activeVendor).toBeUndefined();
      let appTitleEl = fixture.debugElement.query(By.css('h1'));
      expect(appTitleEl.nativeElement.innerText).toBe("");
      expect(descSpy).toHaveBeenCalledTimes(0);
      expect(widgetsSpy).toHaveBeenCalledTimes(0);
      expect(clientRolesSpy).toHaveBeenCalledTimes(0);
      expect(roleMappingsSpy).toHaveBeenCalledTimes(0);
      expect(commentsSpy).toHaveBeenCalledTimes(0);
    });
  }));

  it('should display the app title and render components if app and activeVendor are set', async(() => {
    let vendorSpy = spyOn(vendorsSvc, 'fetchByUserAndVendorId').and.returnValue(new Observable(observer => {
      observer.next(fakeVendor);
      observer.complete();
    }));
    let appSpy = spyOn(appsSvc, 'fetchVendorApp').and.returnValue(new Observable(observer => {
      observer.next(fakeApp);
      observer.complete();
    }));
    //Spy on child components' ngOnInit without allowing calls to pass to prevent initialization
    let descSpy = spyOn(DescriptorComponent.prototype, 'ngOnInit');
    let widgetsSpy = spyOn(WidgetsComponent.prototype, 'ngOnInit');
    let clientRolesSpy = spyOn(ClientRolesComponent.prototype, 'ngOnInit');
    let roleMappingsSpy = spyOn(EditAppRoleMappingsComponent.prototype, 'ngOnInit');
    let commentsSpy = spyOn(CommentsComponent.prototype, 'ngOnInit');
    component.ngOnInit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(vendorSpy).toHaveBeenCalledTimes(1);
      expect(appSpy).toHaveBeenCalledTimes(1);
      expect(component.app).toEqual(fakeApp);
      expect(component.activeVendor).toEqual(fakeVendor);
      let appTitleEl = fixture.debugElement.query(By.css('h1'));
      expect(appTitleEl.nativeElement.innerText).toBe(component.app.appTitle);
      expect(descSpy).toHaveBeenCalledTimes(1);
      expect(widgetsSpy).toHaveBeenCalledTimes(1);
      expect(clientRolesSpy).toHaveBeenCalledTimes(1);
      expect(roleMappingsSpy).toHaveBeenCalledTimes(1);
      expect(commentsSpy).toHaveBeenCalledTimes(1);
    });
  }));

  it('should notify the user and redirect them if they are not a member of the requested vendor', async(() => {
    let vendorSpy = spyOn(vendorsSvc, 'fetchByUserAndVendorId').and.returnValue(throwError(new Error("Error msg")));
    let router = fixture.debugElement.injector.get(Router);
    let routerSpy = spyOn(router, 'navigateByUrl');
    let notifySvc = fixture.debugElement.injector.get(NotificationService);
    let notifySpy = spyOn(notifySvc, 'notify');
    component.ngOnInit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(vendorSpy).toHaveBeenCalledTimes(1);
      expect(routerSpy).toHaveBeenCalledTimes(1);
      expect(routerSpy).toHaveBeenCalledWith('/portal/app-deployment');
      expect(notifySpy).toHaveBeenCalledTimes(1);
      expect(notifySpy).toHaveBeenCalledWith({
        type: NotificationType.Warning,
        message: "You are not a member of the requested vendor account"
      });
    });
  }));

  it('should update the breacrumbs if vendor and app are successfully fetched', async(() => {
    let crumbsSvc = fixture.debugElement.injector.get(BreadcrumbsService);
    let crumbsSpy = spyOn(crumbsSvc, 'update');
    let vendorSpy = spyOn(vendorsSvc, 'fetchByUserAndVendorId').and.returnValue(new Observable(observer => {
      observer.next(fakeVendor);
      observer.complete();
    }));
    let appSpy = spyOn(appsSvc, 'fetchVendorApp').and.returnValue(new Observable(observer => {
      observer.next(fakeApp);
      observer.complete();
    }));
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(vendorSpy).toHaveBeenCalledTimes(1);
      expect(appSpy).toHaveBeenCalledTimes(1);
      expect(crumbsSpy).toHaveBeenCalledTimes(1);
      expect(crumbsSpy).toHaveBeenCalledWith(new Array<Breadcrumb>(
        {
          title: "Dashboard",
          active: false,
          link: '/portal'
        },
        {
          title: "MicroApp Deployment",
          active: false,
          link: '/portal/app-deployment'
        },
        {
          title: `${fakeVendor.name} Apps`,
          active: false,
          link: `/portal/app-deployment/apps/${fakeVendor.docId}`
        },
        {
          title: `${fakeApp.appTitle} Details`,
          active: true,
          link: null
        }
      ));
    });
  }));
});
