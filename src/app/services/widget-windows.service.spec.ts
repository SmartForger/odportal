/**
 * @description Service facilitating components to add a widget to the windowing system.
 * @author James Marcu
 */

import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { WidgetWindowsService } from './widget-windows.service';
import { Observable, observable } from 'rxjs';
import { Widget } from '../models/widget.model';
import { App } from '../models/app.model';
import { AppWithWidget } from '../models/app-with-widget.model';

describe('WidgetWindowsService', () => {

  const service: WidgetWindowsService = TestBed.get(WidgetWindowsService);
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
  const fakeAppWithWidget: AppWithWidget = {
    app: fakeApp,
    widget: fakeWidget
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        Observable
      ]
    });
   });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should provide an observable'), async(() => {
    let obs = service.observeAddWindow();
    expect(obs).toBeTruthy();
  });

  it('should provide an observable'), async(() => {
    let obs = service.observeAppWindowRemoval();
    expect(obs).toBeTruthy();
  });


  it('should publish a single request for a new window to the generated observable', async(() => {
    let observableCalls: number = 0;
    service.observeAddWindow().subscribe((aww: AppWithWidget) => {
      expect(aww).toEqual(fakeAppWithWidget);
      observableCalls++;
    });
    let spy = spyOn(service, 'addWindow');
    service.addWindow(fakeAppWithWidget);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(observableCalls).toBe(1);
  }));

  it('should publish a single request to remove all windows of the app with the given title to the generated observable', async(() => {
    let observableCalls: number = 0;
    service.observeAppWindowRemoval().subscribe((appTitle) => {
      expect(appTitle).toEqual(fakeAppWithWidget.app.appTitle);
      observableCalls++;
    });
    let spy = spyOn(service, 'removeAppWindows');
    service.removeAppWindows(fakeAppWithWidget.app.appTitle);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(observableCalls).toBe(1);
  }));
});
