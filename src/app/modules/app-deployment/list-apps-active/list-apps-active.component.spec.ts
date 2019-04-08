import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';

import { ListAppsActiveComponent } from './list-apps-active.component';
import {MatIconModule, MatIcon} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {App} from '../../../models/app.model';

fdescribe('ListAppsActiveComponent', () => {
  let component: ListAppsActiveComponent;
  let fixture: ComponentFixture<ListAppsActiveComponent>;

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
        ListAppsActiveComponent 
      ],
      imports: [
        MatIconModule,
        MatTooltipModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAppsActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list apps and show an icon representing its enabled status for each app', async(() => {
    expect(component.apps.length).toBe(0);
    component.apps = fakeApps;
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      let trs = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(trs.length).toBe(2);
      let enabledIcon = trs[0].query(By.css('.color-green'));
      expect(enabledIcon).toBeTruthy();
      let disabledIcon = trs[0].query(By.css('.color-red'));
      expect(disabledIcon).toBeNull();
      enabledIcon = trs[1].query(By.css('.color-green'));
      expect(enabledIcon).toBeNull();
      disabledIcon = trs[1].query(By.css('.color-red'));
      expect(disabledIcon).toBeTruthy();
    });
  }));
});
