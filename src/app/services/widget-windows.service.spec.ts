/**
 * @description Service facilitating components to add a widget to the windowing system.
 * @author James Marcu
 */

import { TestBed, async } from '@angular/core/testing';

import { WidgetWindowsService } from './widget-windows.service';
import { Widget } from '../models/widget.model';
import { App } from '../models/app.model';
import { AppWithWidget } from '../models/app-with-widget.model';

describe('WidgetWindowsService', () => {

  let service: WidgetWindowsService;
  
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
    TestBed.configureTestingModule({ });

    service = TestBed.get(WidgetWindowsService);
  });

  it('should be created', async(() => {
    expect(service).toBeTruthy();
  }));

  it('should provide an observable', async(() => {
    let obs = service.observeAddWindow();
    expect(obs).toBeTruthy();
  }));

  it('should provide an observable', async(() => {
    let obs = service.observeAppWindowRemoval();
    expect(obs).toBeTruthy();
  }));

  it('should publish a single request for a new window to the generated observable', async(() => {
    service.observeAddWindow().subscribe(
      (aww: AppWithWidget) => {
        expect(aww).toBeTruthy();
        expect(aww).toEqual(fakeAppWithWidget);
      }
    );
    let spy = spyOn(service, 'addWindow');
    service.addWindow(fakeAppWithWidget);
    
    expect(spy).toHaveBeenCalledTimes(1);
  }));

  it('should publish a single request to remove all windows of the app with the given title to the generated observable', async(() => {
    service.observeAppWindowRemoval().subscribe((appTitle) => {
      expect(appTitle).toBeTruthy();
      expect(appTitle).toEqual(fakeAppWithWidget.app.appTitle);
    });
    let spy = spyOn(service, 'removeAppWindows');
    service.removeAppWindows(fakeAppWithWidget.app.appTitle);
    expect(spy).toHaveBeenCalledTimes(1);
  }));
  
});
