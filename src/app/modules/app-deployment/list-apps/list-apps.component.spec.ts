import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {By} from '@angular/platform-browser';

import { ListAppsComponent } from './list-apps.component';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {ListAppsActiveComponent} from '../list-apps-active/list-apps-active.component';
import {MatTabsModule} from '@angular/material/tabs';
import {ListAppsPendingComponent} from '../list-apps-pending/list-apps-pending.component';
import {MatDialogModule, MatDialog} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Vendor} from '../../../models/vendor.model';
import {App} from '../../../models/app.model';
import {VendorsService} from '../../../services/vendors.service';
import {AppsService} from '../../../services/apps.service';
import {Observable, of, throwError} from 'rxjs';
import {EventEmitter} from '@angular/core';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';

class MatDialogRef {
  componentInstance = {
    uploadProgress: 0,
    fileChosen: new EventEmitter<File>(),
    clear: () => {},
    errorMessage: ""
  };
  close(): void { }
}

class MatDialogMock {
  mdr: MatDialogRef;

  open() {
    return this.mdr;
  }
}

describe('ListAppsComponent', () => {
  let component: ListAppsComponent;
  let fixture: ComponentFixture<ListAppsComponent>;
  let vendorsSvc: VendorsService;
  let appsSvc: AppsService;
  let notifySvc: NotificationService;
  let router: Router;
  let crumbsSvc: BreadcrumbsService;

  const fakeVendor: Vendor = {
    docId: "fake-vendor-id",
    name: "Fake Vendor",
    pocPhone: "555-555-5555",
    pocEmail: "fake@test.com"
  };

  const fakeApps: Array<App> = new Array<App>(
    {
      docId: "fake-app-one",
      appTitle: "Fake App One",
      enabled: true,
      native: false,
      approved: true,
      vendorId: "fake-vendor-id",
      clientId: "fake-client-one",
      clientName: "fake client one"
    },
    {
      docId: "fake-app-two",
      appTitle: "Fake App Two",
      enabled: true,
      native: false,
      approved: false,
      vendorId: "fake-vendor-id",
      clientId: "fake-client-one",
      clientName: "fake client one"
    }
  );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ListAppsComponent,
        ListAppsActiveComponent,
        ListAppsPendingComponent
      ],
      imports: [
        MatIconModule,
        MatGridListModule,
        MatTabsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
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
    fixture = TestBed.createComponent(ListAppsComponent);
    component = fixture.componentInstance;
    vendorsSvc = fixture.debugElement.injector.get(VendorsService);
    appsSvc = fixture.debugElement.injector.get(AppsService);
    router = fixture.debugElement.injector.get(Router);
    notifySvc = fixture.debugElement.injector.get(NotificationService);
    crumbsSvc = fixture.debugElement.injector.get(BreadcrumbsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch the vendor, list all vendor apps, and set breadcrumbs', async(() => {
    let vendorSpy = spyOn(vendorsSvc, 'fetchByUserAndVendorId').and.returnValue(new Observable(observer => {
      observer.next(fakeVendor);
      observer.complete();
    }));
    let appsSpy = spyOn(appsSvc, 'listVendorApps').and.returnValue(new Observable(observer => {
      observer.next(fakeApps);
      observer.complete();
    }));
    let crumbsSpy = spyOn(crumbsSvc, 'update');
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(vendorSpy).toHaveBeenCalledTimes(1);
      expect(appsSpy).toHaveBeenCalledTimes(1);
      expect(component.activeVendor).toBe(fakeVendor);
      expect(component.approvedApps).toEqual([fakeApps[0]]);
      expect(component.pendingApps).toEqual([fakeApps[1]]);
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
          active: true,
          link: null
        }
      ));
    });
  }));

  it('it should show the Create button for uploading apps if they have the Create role', () => {
    let createBtnEl = fixture.debugElement.query(By.css('.test-create-button'));
    expect(createBtnEl).toBeNull();
    component.canCreate = true;
    fixture.detectChanges();
    createBtnEl = fixture.debugElement.query(By.css('.test-create-button'));
    expect(createBtnEl).toBeTruthy();
  });

  it('should show the upload dialog if the Create button is clicked', async(() => {
    let dialog = TestBed.get(MatDialog);
    dialog.mdr = new MatDialogRef();
    let dialogOpenSpy = spyOn(dialog, 'open').and.callThrough();
    component.canCreate = true;
    fixture.detectChanges();
    let createBtnEl = fixture.debugElement.query(By.css('.test-create-button'));
    createBtnEl.nativeElement.click();
    fixture.whenStable().then(() => {
      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
    });
  }));

  it('should upload an app bundle, create a success notification, and redirect the user', async(() => {
    let dialog = TestBed.get(MatDialog);
    dialog.mdr = new MatDialogRef();
    component.activeVendor = fakeVendor;
    let routerSpy = spyOn(router, 'navigateByUrl');
    let appsSpy = spyOn(appsSvc, 'create').and.returnValue(
      of(new HttpResponse({status: 200, body: fakeApps[0]}))
    );
    let closeSpy = spyOn(dialog.mdr, 'close');
    let notifySpy = spyOn(notifySvc, 'notify');
    const fakeFile: File = new File([], "bundle.zip");
    component.uploadBundle(fakeFile, dialog.mdr);
    fixture.whenStable().then(() => {
      expect(appsSpy).toHaveBeenCalledTimes(1);
      expect(appsSpy).toHaveBeenCalledWith(fakeFile);
      expect(dialog.mdr.componentInstance.uploadProgress).toBe(100);
      expect(closeSpy).toHaveBeenCalledTimes(1);
      expect(notifySpy).toHaveBeenCalledTimes(1);
      expect(notifySpy).toHaveBeenCalledWith({
        message: "Your app was uploaded successfully",
        type: NotificationType.Success
      });
      expect(routerSpy).toHaveBeenCalledTimes(1);
      expect(routerSpy).toHaveBeenCalledWith(`/portal/app-deployment/edit/${fakeVendor.docId}/${fakeApps[0].docId}`);
    });
  }));

  it('should clear CreateAppFormComponent and set its error message per the HTTP response', async(() => {
    let dialog = TestBed.get(MatDialog);
    dialog.mdr = new MatDialogRef();
    let appsSpy = spyOn(appsSvc, 'create').and.returnValue(
      throwError({error: {message: "test error"}})
    );
    let clearSpy = spyOn(dialog.mdr.componentInstance, 'clear').and.callThrough();
    const fakeFile: File = new File([], "bundle.zip");
    component.uploadBundle(fakeFile, dialog.mdr);
    fixture.whenStable().then(() => {
      expect(appsSpy).toHaveBeenCalledTimes(1);
      expect(appsSpy).toHaveBeenCalledWith(fakeFile);
      expect(clearSpy).toHaveBeenCalledTimes(1);
      expect(dialog.mdr.componentInstance.errorMessage).toBe("test error");
    });
  }));


});
