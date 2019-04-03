/**
 * @description Service to facilitate the dashboard feature. Talks to the server for managing user dashboards. Allows external components to add widgets to the dashboard.
 * @author James Marcu
 */

import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DashboardService } from './dashboard.service';
import { AuthService } from './auth.service';
import { Widget } from '../models/widget.model';
import { App } from '../models/app.model';
import { UserDashboard } from '../models/user-dashboard.model';
import { WidgetGridItem } from '../models/widget-grid-item.model'
import { AppWithWidget } from '../models/app-with-widget.model';

describe('DashboardService', () => {
  let service: DashboardService;
  let backend: HttpTestingController;
  let authSvc: AuthService;

  const fakeUserId: string = 'fake-user-id';
  const fakeWidget: Widget = {
    widgetTitle: 'Fake Widget',
    widgetTag: 'fake-widget-tag',
    widgetBootstrap: '',
    docId: 'fake-widget-id'
  }
  const fakeApp: App = {
    appTitle: 'fake-app',
    enabled: true,
    native: true,
    clientId: 'fake-client-id',
    clientName: 'Fake Client',
    docId: 'fake-app-id',
    widgets: [ fakeWidget ]
  };
  const fakeDashboard: UserDashboard = {
    userId: 'fake-user-id',
    gridItems: [ 
      {
        parentAppId: 'fake-app-id',
        widgetId: 'fake-widget-id',
        gridsterItem: {
          x: 0, y: 0,
          cols: 0, rows: 0
        }
      }
    ],
    default: true,
    docId: 'fake-dashboard-id'
  };

  beforeEach(() => {
   TestBed.configureTestingModule({
     imports: [
      HttpClientTestingModule
     ],
     providers: [
       AuthService
     ]
   });

   service = TestBed.get(DashboardService);
   backend = TestBed.get(HttpTestingController);
   authSvc = TestBed.get(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list dashboards owned by the logged-in user', async(() => {
    service.listDashboards().subscribe(
      (dashboards: Array<UserDashboard>) => {
        expect(dashboards.length).toBe(1);
        expect(dashboards[0]).toEqual(fakeDashboard);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.userProfileServiceConnection}api/v1/dashboard/realm/${authSvc.globalConfig.realm}/user/${fakeUserId}`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush([fakeDashboard]);
    backend.verify();
  }));

  it('should add a dashboard to the list of dashboards on the backend and return that new dashboard', async(() => {
    let newFakeDashboard = {
      userId: 'fake-user-id',
      gridItems: [ 
        {
          parentAppId: 'fake-app-id',
          widgetId: 'fake-widget-id',
          gridsterItem: {
            x: 0, y: 0,
            cols: 0, rows: 0
          }
        }
      ],
      default: true,
      docId: 'new-fake-dashboard-id'
    };
    service.addDashboard(newFakeDashboard).subscribe(
      (newDash) => {
        expect(newDash.docId).toBe('new-fake-dashboard-id');
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.userProfileServiceConnection}api/v1/dashboard/realm/${authSvc.globalConfig.realm}/user/${fakeUserId}`);
    expect(mockReq.request.method).toBe('POST');
    mockReq.flush(newFakeDashboard);
    backend.verify();
  }));

  it('should return the dashboard object associated with the provided dash id', async(() => {
    service.getDashboard(fakeDashboard.docId).subscribe(
      (dash) => {
        expect(dash).toEqual(fakeDashboard);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.userProfileServiceConnection}api/v1/dashboard/realm/${authSvc.globalConfig.realm}/user/${fakeUserId}/${fakeDashboard.docId}`);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush(fakeDashboard);
    backend.verify();
  }));

  it('should replace the old instance of dashboard with the new one on the backend and return the updated dashboard', async(() => {
    let updatedFakeDashboard = {
      userId: 'fake-user-id',
      title: 'Updated Fake Dashboard',
      gridItems: [ 
        {
          parentAppId: 'fake-app-id',
          widgetId: 'fake-widget-id',
          gridsterItem: {
            x: 0, y: 0,
            cols: 0, rows: 0
          }
        }
      ],
      default: true,
      docId: 'fake-dashboard-id'
    };
    service.updateDashboard(updatedFakeDashboard).subscribe(
      (updatedDash) => {
        expect(updatedDash.docId).toBe('fake-dashboard-id');
        expect(updatedDash.title).toBe('Updated Fake Dashboard');
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.userProfileServiceConnection}api/v1/dashboard/realm/${authSvc.globalConfig.realm}/user/${fakeUserId}/${fakeDashboard.docId}`);
    expect(mockReq.request.method).toBe('PUT');
    mockReq.flush(updatedFakeDashboard);
    backend.verify();
  }));

  it('should delete the dashboard with the provided id on the backend and return the deleted dashboard', async(() => {
    service.deleteDashboard(fakeDashboard.docId).subscribe(
      (deletedDash) => {
        expect(deletedDash).toEqual(fakeDashboard);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.userProfileServiceConnection}api/v1/dashboard/realm/${authSvc.globalConfig.realm}/user/${fakeUserId}/${fakeDashboard.docId}`);
    expect(mockReq.request.method).toBe('DELETE');
    mockReq.flush(fakeDashboard);
    backend.verify();
  }));

  it('should ensure that the dashboard with the provided id has its default field be true and all others have theirs be false, then return that default dashboard', async(() => {
    let fakeDashboardButNotDefault = {
      userId: 'fake-user-id',
      title: 'Updated Fake Dashboard',
      gridItems: [ 
        {
          parentAppId: 'fake-app-id',
          widgetId: 'fake-widget-id',
          gridsterItem: {
            x: 0, y: 0,
            cols: 0, rows: 0
          }
        }
      ],
      default: false,
      docId: 'fake-dashboard-id'
    };
    service.setDefaultDashboard(fakeDashboardButNotDefault.docId).subscribe(
      (defaultDash) => {
        expect(defaultDash.default).toBe(true);
        expect(defaultDash).toEqual(fakeDashboard);
      }
    );
    const mockReq = backend.expectOne(`${authSvc.globalConfig.userProfileServiceConnection}api/v1/dashboard/realm/${authSvc.globalConfig.realm}/user/${fakeUserId}/${fakeDashboard.docId}/default`);
    expect(mockReq.request.method).toBe('PATCH');
    mockReq.flush(fakeDashboard);
    backend.verify();
  }));

  it('should get an observable for watching the AddWidgetSubject, then publish an AppWithWidget', async(() => {
    let fakeAppWithWidget: AppWithWidget = {app: fakeApp, widget: fakeWidget};
    service.observeAddWidget().subscribe((modelPair) => {
      expect(modelPair).toBeTruthy();
      expect(modelPair).toEqual(fakeAppWithWidget);
      
    });
    let spy = spyOn(service, 'addWidget');
    service.addWidget(fakeAppWithWidget);
    expect(spy).toHaveBeenCalledTimes(1);
  }));
});
