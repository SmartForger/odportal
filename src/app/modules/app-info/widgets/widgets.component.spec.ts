import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import { WidgetsComponent } from './widgets.component';
import {App} from '../../../models/app.model';
import {Widget} from '../../../models/widget.model';

describe('WidgetsComponent', () => {
  let component: WidgetsComponent;
  let fixture: ComponentFixture<WidgetsComponent>;  

  const fakeApp: App = {
    docId: "fake-app-id",
    appTitle: "Fake App",
    enabled: true,
    native: false,
    clientId: "fake-client-id",
    clientName: "fake-client",
    widgets: new Array<Widget>(
      {
        docId: "fake-widget",
        widgetTitle: "Fake Widget",
        widgetTag: "fake-widget",
        widgetBootstrap: "fake-widget.js"
      }
    )
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetsComponent);
    component = fixture.componentInstance;
    component.app = fakeApp;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display info for all widgets that belong to the app', () => {
    expect(component.app.widgets.length).toBe(1);
    let trs = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(trs.length).toBe(component.app.widgets.length);
  });
});
