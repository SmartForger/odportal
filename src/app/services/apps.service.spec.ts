import { TestBed, async } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import { AppsService } from './apps.service';
import {App} from '../models/app.model';
import {AuthService} from './auth.service';
import {AppComment} from '../models/app-comment.model';
import { HttpEventType } from '@angular/common/http';
import {Subscription} from 'rxjs';

describe('AppsService', () => {
  let backend: HttpTestingController;
  let service: AppsService;
  let authSvc: AuthService;

  const fakeApp: App = {
    docId: "fake-app-id",
    appTitle: "fake app",
    enabled: true,
    clientId: "fake-client-id",
    native: false,
    clientName: "fake client name"
  };

  const fakeComment: AppComment = {
    docId: "fake-comment-id",
    message: "Test message",
    isFromVendor: false
  };

  const fakeUserId: string = "fake-userid";
  const fakeAppId: string = "fake-app-id";
  const fakeRoleId: string = "fake-role-id";
  const fakeVendorId: string = "fake-vendor-id";
  const fakeCommentId: string = "fake-comment-id";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AuthService
      ]
    });

    backend = TestBed.get(HttpTestingController);
    service = TestBed.get(AppsService);
    authSvc = TestBed.get(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list apps accessible by the logged-in user', async(() => {
    service.listUserApps(fakeUserId).subscribe(
      (apps: Array<App>) => {
        expect(apps.length).toBe(1);
        expect(apps[0]).toEqual(fakeApp);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.appsServiceConnection}api/v1/apps/realm/${authSvc.globalConfig.realm}/user/${fakeUserId}`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush([fakeApp]);
    backend.verify();
  }));

  it('should list apps bound to a specific role', async(() => {
    service.listRoleApps(fakeRoleId).subscribe(
      (apps: Array<App>) => {
        expect(apps.length).toBe(1);
        expect(apps[0]).toEqual(fakeApp);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.appsServiceConnection}api/v1/apps/realm/${authSvc.globalConfig.realm}/role/${fakeRoleId}`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush([fakeApp]);
    backend.verify();
  }));

  it('should list apps bound to a specific vendor', async(() => {
    service.listVendorApps(fakeVendorId).subscribe(
      (apps: Array<App>) => {
        expect(apps.length).toBe(1);
        expect(apps[0]).toEqual(fakeApp);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.appsServiceConnection}api/v1/apps/realm/${authSvc.globalConfig.realm}/vendor/${fakeVendorId}`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush([fakeApp]);
    backend.verify();
  }));

  it('should fetch a single app bound to a vendor', async(() => {
    service.fetchVendorApp(fakeVendorId, fakeAppId).subscribe(
      (app: App) => {
        expect(app).toBeTruthy();
        expect(app).toEqual(fakeApp);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.appsServiceConnection}api/v1/apps/realm/${authSvc.globalConfig.realm}/vendor/${fakeVendorId}/app/${fakeAppId}`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush(fakeApp);
    backend.verify();
  }));

  it('should fetch comments for a specific app bound to a vendor', async(() => {
    service.fetchVendorAppComments(fakeVendorId, fakeAppId).subscribe(
      (comments: Array<AppComment>) => {
        expect(comments.length).toBe(1);
        expect(comments[0]).toEqual(fakeComment);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.appsServiceConnection}api/v1/apps/realm/${authSvc.globalConfig.realm}/vendor/${fakeVendorId}/app/${fakeAppId}/comments`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush([fakeComment]);
    backend.verify();
  }));

  it('should list all apps', async(() => {
    service.listApps().subscribe(
      (apps: Array<App>) => {
        expect(apps.length).toBe(1);
        expect(apps[0]).toEqual(fakeApp);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.appsServiceConnection}api/v1/apps/realm/${authSvc.globalConfig.realm}`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush([fakeApp]);
    backend.verify();
  }));

  it('should create an app and return it', async(() => {
    let file: File = new File([], "fake-file.png");
    service.create(file).subscribe(event => {
      if (event.type === HttpEventType.Response) {
        expect(event.body).toEqual(fakeApp);
      }
    });
    const mockReq = backend.expectOne(`${authSvc.globalConfig.appsServiceConnection}api/v1/apps/realm/${authSvc.globalConfig.realm}`);
    expect(mockReq.request.method).toBe('POST');
    mockReq.flush(fakeApp);
    backend.verify();
  }));

  it('should create a comment and return it', async(() => {
    service.postComment(fakeVendorId, fakeAppId, fakeComment).subscribe(
      (comment: AppComment) => {
        expect(comment).toEqual(fakeComment);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.appsServiceConnection}api/v1/apps/realm/${authSvc.globalConfig.realm}/vendor/${fakeVendorId}/app/${fakeAppId}/comments`);
    expect(mockReq.request.method).toBe('POST');
    mockReq.flush(fakeComment);
    backend.verify();
  }));

  it('should update and return an app', async(() => {
    service.update(fakeApp).subscribe(
      (app: App) => {
        expect(app).toEqual(fakeApp);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.appsServiceConnection}api/v1/apps/realm/${authSvc.globalConfig.realm}/app/${fakeApp.docId}`);
    expect(mockReq.request.method).toBe('PUT');
    mockReq.flush(fakeApp);
    backend.verify();
  }));

  it('should fetch an app', async(() => {
    service.fetch(fakeAppId).subscribe(
      (app: App) => {
        expect(app).toEqual(fakeApp);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.appsServiceConnection}api/v1/apps/realm/${authSvc.globalConfig.realm}/app/${fakeAppId}`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush(fakeApp);
    backend.verify();
  }));

  it('should delete an app and return the deleted app', async(() => {
    service.delete(fakeAppId).subscribe(
      (app: App) => {
        expect(app).toEqual(fakeApp);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.appsServiceConnection}api/v1/apps/realm/${authSvc.globalConfig.realm}/app/${fakeAppId}`);
    expect(mockReq.request.method).toBe('DELETE');
    mockReq.flush(fakeApp);
    backend.verify();
  }));

  it('should observe app cache changes with a subscription', async(() => {
    let firstPass: boolean = true;
    let sub: Subscription = service.observeLocalAppCache().subscribe(
      (apps: Array<App>) => {
        if (!firstPass) {
          expect(apps.length).toBe(1);
          expect(apps[0]).toEqual(fakeApp);
          expect(apps).toEqual(service.getLocalAppCache());
          sub.unsubscribe();  
        }
        else {
          expect(apps.length).toBe(0);
          firstPass = false;
        }
      }
    );
    service.setLocalAppCache([fakeApp]);
  }));

  it('should observe app updates with a subscription', async(() => {
    let sub: Subscription = service.observeAppUpdates().subscribe(
      (app: App) => {
        expect(app).toEqual(fakeApp);
        sub.unsubscribe();
      }
    );
    service.appUpdated(fakeApp);
  }));

});
