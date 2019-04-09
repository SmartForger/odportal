import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';

import { ListAppsPendingComponent } from './list-apps-pending.component';
import {App} from '../../../models/app.model';

describe('ListAppsPendingComponent', () => {
  let component: ListAppsPendingComponent;
  let fixture: ComponentFixture<ListAppsPendingComponent>;

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
    }
  );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ListAppsPendingComponent 
      ],
      imports: [
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAppsPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list apps', async(() => {
    expect(component.apps.length).toBe(0);
    component.apps = fakeApps;
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      let trs = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(trs.length).toBe(component.apps.length);
    });
  }));
});
