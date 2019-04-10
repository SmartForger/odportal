import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { ListAppsComponent } from './list-apps.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTabsModule} from '@angular/material/tabs';
import {ListNativeAppsComponent} from '../list-native-apps/list-native-apps.component';
import {ListPendingAppsComponent} from '../list-pending-apps/list-pending-apps.component';
import {ListApprovedAppsComponent} from '../list-approved-apps/list-approved-apps.component';
import {MatIconModule} from '@angular/material/icon';
import {AppsService} from '../../../services/apps.service';
import {Observable} from 'rxjs';
import {App} from '../../../models/app.model';
import {BreadcrumbsService} from '../../display-elements/breadcrumbs.service';
import {Breadcrumb} from '../../display-elements/breadcrumb.model';

describe('ListAppsComponent', () => {
  let component: ListAppsComponent;
  let fixture: ComponentFixture<ListAppsComponent>;
  let appsSvc: AppsService;
  let crumbsSvc: BreadcrumbsService;

  const fakeApps: Array<App> = new Array<App>(
    {
      docId: "fake-app-one",
      appTitle: "Fake App One",
      enabled: true,
      native: false,
      approved: true,
      vendorId: "fake-vendor-id",
      clientId: "fake-client-one",
      clientName: "fake client one",
      version: "1.0.0",
      widgets: []
    },
    {
      docId: "fake-app-two",
      appTitle: "Fake App Two",
      enabled: false,
      native: false,
      approved: false,
      vendorId: "fake-vendor-id",
      clientId: "fake-client-one",
      clientName: "fake client one",
      version: "1.1.1",
      widgets: []
    },
    {
      docId: "fake-app-three",
      appTitle: "Fake App Three",
      enabled: true,
      native: true,
      clientId: "fake-client-three",
      clientName: "fake client three",
      version: "1.1.0",
      widgets: []
    }
  );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ListAppsComponent,
        ListApprovedAppsComponent,
        ListPendingAppsComponent,
        ListNativeAppsComponent
      ],
      imports: [
        MatGridListModule,
        MatTabsModule,
        MatIconModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAppsComponent);
    component = fixture.componentInstance;
    appsSvc = fixture.debugElement.injector.get(AppsService);
    crumbsSvc = fixture.debugElement.injector.get(BreadcrumbsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve all apps, place them in the correct array, and generate breadcrumbs', async(() => {
    let appsSpy = spyOn(appsSvc, 'listApps').and.returnValue(new Observable(observer => {
      observer.next(fakeApps);
      observer.complete();
    }));
    let crumbsSpy = spyOn(crumbsSvc, 'update');
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(appsSpy).toHaveBeenCalledTimes(1);
      expect(component.nativeApps.length).toBe(1);
      expect(component.nativeApps[0]).toEqual(fakeApps[2]);
      expect(component.pendingApps.length).toBe(1);
      expect(component.pendingApps[0]).toEqual(fakeApps[1]);
      expect(component.approvedApps.length).toBe(1);
      expect(component.approvedApps[0]).toEqual(fakeApps[0]);
      expect(crumbsSpy).toHaveBeenCalledTimes(1);
      expect(crumbsSpy).toHaveBeenCalledWith(new Array<Breadcrumb>(
        {
          title: "Dashboard",
          active: false,
          link: '/portal'
        },
        {
          title: "MicroApp Manager",
          active: true,
          link: null
        }
      ));
    });
  }));
});
