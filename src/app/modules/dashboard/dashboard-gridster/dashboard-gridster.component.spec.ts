import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DashboardGridsterComponent } from './dashboard-gridster.component';
import { Component, Input, Output, EventEmitter, ElementRef, Inject, DebugElement } from '@angular/core';
import { App } from 'src/app/models/app.model';
import { Widget } from 'src/app/models/widget.model';
import { WidgetRendererFormat } from 'src/app/models/widget-renderer-format.model';
import { UserDashboard } from 'src/app/models/user-dashboard.model';
import { AppsService } from 'src/app/services/apps.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { WidgetWindowsService } from 'src/app/services/widget-windows.service';
import { GridsterModule } from 'angular-gridster2';
import { MaterialModule } from '../../../material.module';
import { of, Subject } from 'rxjs';
import { AppWithWidget } from 'src/app/models/app-with-widget.model';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-widget-renderer',
  template: '<div>Widget Renderer Mock</div>'
})
export class WidgetRendererMock{
  @Input('app')
  get app(): App{ 
    return this._app;
  }
  set app(app: App){ 
    this._app = app; 
    this.el.setAttribute('appstring', JSON.stringify(app));
  }
  private _app: App;

  @Input('widget')
  get widget(): Widget{ 
    return this._widget;
  }
  set widget(widget: Widget){ 
    this._widget = widget; 
    this.el.setAttribute('widgetstring', JSON.stringify(widget));
  }
  private _widget: Widget;


  @Input('format')
  get format(): WidgetRendererFormat{ 
    return this._format;
  }
  set format(format: WidgetRendererFormat){ 
    this._format = format; 
    this.el.setAttribute('formatstring', JSON.stringify(format));
  }
  private _format: WidgetRendererFormat;


  @Input('resize')
  get resize(): any{ 
    return this._resize;
  }
  set resize(resize: any){ 
    this._resize = resize; 
    this.el.setAttribute('resizestring', JSON.stringify(resize));
  }
  private _resize: any;

  @Output() leftBtnClick: EventEmitter<void>;
  @Output() middleBtnClick: EventEmitter<void>;
  @Output() rightBtnClick: EventEmitter<void>;
  @Output() stateChanged: EventEmitter<any>;

  el: HTMLElement;

  constructor(@Inject(ElementRef) elementRef) {
    this.leftBtnClick = new EventEmitter<void>();
    this.middleBtnClick = new EventEmitter<void>();
    this.rightBtnClick = new EventEmitter<void>();
    this.stateChanged = new EventEmitter<void>();
    this.el = elementRef.nativeElement;
  }
}

export class MatDialogRef{
  componentInstance: any;
  close(): void { }
}

export class MatDialogMock{
  mdr: MatDialogRef;

  open() {
    return this.mdr;
  }
}

describe('DashboardGridsterComponent', () => {
  let component: DashboardGridsterComponent;
  let fixture: ComponentFixture<DashboardGridsterComponent>;
  let appsSvcStub: Partial<AppsService> = {};
  appsSvcStub.observeLocalAppCache = () => {
    return of([mockApp]);
  }
  let dashSvcStub: Partial<DashboardService> = {};
  let widgetWindowsSvcStub: Partial<WidgetWindowsService> = {};
  widgetWindowsSvcStub.addWindow = () => {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        DashboardGridsterComponent ,
        WidgetRendererMock
      ],
      imports: [
        GridsterModule,
        MaterialModule
      ],
      providers: [
        {provide: AppsService, useValue: appsSvcStub},
        {provide: DashboardService, useValue: dashSvcStub},
        {provide: WidgetWindowsService, useValue: widgetWindowsSvcStub},
        {provide: MatDialog, useClass: MatDialogMock}
      ]
    })
    .compileComponents();
  }));

  let dialog: MatDialogMock;
  let mockUserId: string;
  let mockWidget: Widget;
  let mockApp: App;
  let mockDash: UserDashboard;

  beforeEach(() => {
    mockUserId = 'fake-user-id';
    mockWidget = {
      widgetTitle: 'Mock Widget',
      widgetTag: 'mock-widget',
      widgetBootstrap: '',
      docId: 'mock-widget-id'
    }
    mockApp = {
      appTitle: 'Mock App',
      native: true,
      enabled: true,
      clientId: 'mock-client-id',
      clientName: 'Mock Client',
      docId: 'mock-app-id',
      widgets: [ mockWidget ]
    }
    mockDash = {
      userId: mockUserId,
      gridItems: [
        {
          parentAppId: 'mock-app-id',
          widgetId: 'mock-widget-id',
          gridsterItem: {x: 0, y: 0, cols: 2, rows: 2}
        }
      ],
      default: true,
      title: 'Mock Dash',
      description: 'The mock dashboard.',
      docId: 'mock-dash-id'
    };
    dialog = TestBed.get(MatDialog);
    dialog.mdr = new MatDialogRef();
    fixture = TestBed.createComponent(DashboardGridsterComponent);
    component = fixture.componentInstance;
    component.dashboard = mockDash;
    component.editMode = false;
    fixture.detectChanges();
    component.ngOnInit();
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind to gridster-item', () => {
    let gridsterItemEls = fixture.debugElement.queryAll(By.css('gridster-item'));
    expect(gridsterItemEls.length).toBe(component.dashboard.gridItems.length);

    component.dashboard.gridItems.push({
      parentAppId: 'mock-app-id',
      widgetId: 'mock-widget-id',
      gridsterItem: {x: 4, y: 4, cols: 2, rows: 2}
    });
    fixture.detectChanges();

    gridsterItemEls = fixture.debugElement.queryAll(By.css('gridster-item'));
    expect(gridsterItemEls.length).toBe(component.dashboard.gridItems.length);
  });

  it('should bind to the input fields of app-widget-renderer, both inside of gridster and when maximized', () => {
    let rendererDe: DebugElement = fixture.debugElement.query(By.css('app-widget-renderer'));

    let app = rendererDe.nativeElement.getAttribute('appstring');
    let widget = rendererDe.nativeElement.getAttribute('widgetstring');
    let format = rendererDe.nativeElement.getAttribute('formatstring');
    let resize = rendererDe.nativeElement.getAttribute('resizestring');

    expect(app).toEqual(JSON.stringify(component.models[0].app));
    expect(widget).toEqual(JSON.stringify(component.models[0].widget));
    expect(format).toEqual(JSON.stringify(component.rendererFormat));
    expect(resize).toEqual(JSON.stringify(component.resize));

    rendererDe.triggerEventHandler('leftBtnClick', 0);
    fixture.detectChanges();
    rendererDe = fixture.debugElement.query(By.css('.maximizedWidget'));

    app = rendererDe.nativeElement.getAttribute('appstring');
    widget = rendererDe.nativeElement.getAttribute('widgetstring');
    format = rendererDe.nativeElement.getAttribute('formatstring');
    resize = rendererDe.nativeElement.getAttribute('resizestring');

    expect(app).toEqual(JSON.stringify(component.models[0].app));
    expect(widget).toEqual(JSON.stringify(component.models[0].widget));
    expect(format).toEqual(JSON.stringify(component.maximizeRendererFormat));
    expect(resize).toBe(null);
  });

  it('should toggle editMode', () => {
    component.editMode = false;

    component.toggleEditMode();
    expect(component.editMode = true);

    component.toggleEditMode();
    expect(component.editMode = false);
  });

  it('should maximize a widget, then minimize it, then maximize it', async(() => {
    let maximizeSpy = spyOn(component, 'maximizeWidget').and.callThrough();
    let rendererEl = fixture.debugElement.query(By.css('app-widget-renderer'));
    rendererEl.triggerEventHandler('leftBtnClick', 0);
    fixture.detectChanges();
    
    fixture.whenStable().then(() => {
      expect(maximizeSpy).toHaveBeenCalledTimes(1);
      expect(component.maximizeIndex).toBe(0);
      expect(component.maximize).toBe(true);

      let minimizeSpy = spyOn(component, 'minimizeWidget').and.callThrough();
      rendererEl = fixture.debugElement.query(By.css('.maximizedWidget'));
      rendererEl.triggerEventHandler('rightBtnClick', null);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(minimizeSpy).toHaveBeenCalledTimes(1);
        expect(component.maximize).toBe(false);
      });
    });
  }));

  it('should popout a widget, then maximize the widget and pop it out again', async(() => {
    let popoutSpy = spyOn(component, 'popout').and.callThrough();
    let wwSpy = spyOn(fixture.debugElement.injector.get(WidgetWindowsService), 'addWindow').and.callFake(
      (aww: AppWithWidget) => {
        expect(aww).toEqual(component.models[0]);
      }
    );
    let rendererEl = fixture.debugElement.query(By.css('app-widget-renderer'));
    rendererEl.triggerEventHandler('middleBtnClick', 0);
    rendererEl.triggerEventHandler('leftBtnClick', 0);
    fixture.detectChanges();
    
    fixture.whenStable().then(() => {
      expect(popoutSpy).toHaveBeenCalledTimes(1);

      rendererEl = fixture.debugElement.query(By.css('.maximizedWidget'));
      rendererEl.triggerEventHandler('middleBtnClick', null);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(popoutSpy).toHaveBeenCalledTimes(2);
      });
    });
  }));

  it('should create a modal, then delete the widget', async(() => {
    dialog.mdr = {
      componentInstance: {
        title: '',
        message: '',
        icons: [],
        buttons: [],
        btnClick: new Subject<string>()
      },
      close: () => {}
    }
    let deleteSpy = spyOn(component, 'deleteWidget').and.callThrough();
    let rendererEl = fixture.debugElement.query(By.css('app-widget-renderer'));
    rendererEl.triggerEventHandler('rightBtnClick', 0);
    
    fixture.whenStable().then(() => {
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(dialog.mdr.componentInstance.title).toBe('Delete Widget');
      expect(dialog.mdr.componentInstance.message).toBe('Are you sure you want to remove this widget from you dashboard?');
      expect(dialog.mdr.componentInstance.icons).toEqual([{icon: 'delete_forever', classList: ''}]);
      expect(dialog.mdr.componentInstance.buttons).toEqual([{title: 'Delete', classList: 'bg-red'}]);
      
      dialog.mdr.componentInstance.btnClick.next('Delete');

      fixture.whenStable().then(() => expect(component.dashboard.gridItems.length).toBe(0));
    });
  }));

  it('should create the delete modal, but not delete the widget', async(() => {
    dialog.mdr = {
      componentInstance: {
        title: '',
        message: '',
        icons: [],
        buttons: [],
        btnClick: new Subject<string>()
      },
      close: () => {}
    }
    let deleteSpy = spyOn(component, 'deleteWidget').and.callThrough();
    let rendererEl = fixture.debugElement.query(By.css('app-widget-renderer'));
    rendererEl.triggerEventHandler('rightBtnClick', 0);
    
    fixture.whenStable().then(() => {
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(dialog.mdr.componentInstance.title).toBe('Delete Widget');
      expect(dialog.mdr.componentInstance.message).toBe('Are you sure you want to remove this widget from you dashboard?');
      expect(dialog.mdr.componentInstance.icons).toEqual([{icon: 'delete_forever', classList: ''}]);
      expect(dialog.mdr.componentInstance.buttons).toEqual([{title: 'Delete', classList: 'bg-red'}]);
      
      dialog.mdr.componentInstance.btnClick.next('Cancel');

      fixture.whenStable().then(() => expect(component.dashboard.gridItems.length).toBe(1));
    });
  }));
});