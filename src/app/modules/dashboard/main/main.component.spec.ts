/**
 * @description Handles data flow into, between, and out of the dashboard components.
 * @author James Marcu
 */

import { Component, Input, Output, EventEmitter, Inject, ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MainComponent } from './main.component';
import { UserDashboard } from 'src/app/models/user-dashboard.model';
import { App } from 'src/app/models/app.model';
import { Widget } from 'src/app/models/widget.model';
import { DashboardService } from 'src/app/services/dashboard.service';
import { of, Subject } from 'rxjs';
import { AppWithWidget } from 'src/app/models/app-with-widget.model';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  const mockUserId: string = 'fake-user-id';
  let mockWidgetOne: Widget;
  let mockAppOne: App;
  let defaultDashboard: UserDashboard;
  let mockDashOne: UserDashboard;

  @Component({
    selector: 'app-dashboard-options',
    template: '<div>Dashboard Options Component</div>'
  })
  class DashboardOptionsComponentStub { 
    @Input('userDashboards') 
    get userDashboards(): Array<UserDashboard>{
      return this._userDashboards();
    }
    set userDashboards(userDashboards: Array<UserDashboard>){
      this.el.setAttribute('user-dashboards-test', JSON.stringify(userDashboards));
      this._userDashboards = userDashboards;
    }
    _userDashboards;

    @Input() dashIndex: number;
    @Input() editMode: boolean;

    @Output() setDashboard: EventEmitter<number>;
    @Output() enterEditMode: EventEmitter<void>;
    @Output() leaveEditMode: EventEmitter<void>;

    el: HTMLElement;

    constructor(@Inject(ElementRef) elementRef: ElementRef) {
      this.setDashboard = new EventEmitter<number>();
      this.enterEditMode = new EventEmitter<void>();
      this.leaveEditMode = new EventEmitter<void>();
      this.el = elementRef.nativeElement;
    }
  }

  @Component({
    selector: 'app-dashboard-gridster',
    template: '<div>Dashboard Gridster Component</div>'
  })
  class DashboardGridsterComponentStub {
    @Input() dashboard: UserDashboard;
    @Input() editMode: boolean;
  }

  let dashSvcStub: Partial<DashboardService>;
  let dashSvcStubAddWidgetSubject: Subject<AppWithWidget>
  let dashSvc: Partial<DashboardService>;
  let optionsEl: HTMLElement;

  beforeEach(async(() => {
    dashSvcStubAddWidgetSubject = new Subject<AppWithWidget> ();
    dashSvcStub = {
      activeDashboardId: ''
    };
    dashSvcStub.listDashboards = () => of([ mockDashOne ]);
    dashSvcStub.observeAddWidget = () => dashSvcStubAddWidgetSubject.asObservable();
    dashSvcStub.updateDashboard = (dash: UserDashboard) => of(dash);

    TestBed.configureTestingModule({
      declarations: [ 
        MainComponent, 
        DashboardOptionsComponentStub,
        DashboardGridsterComponentStub
      ],
      providers: [
        {provide: DashboardService, useValue: dashSvcStub}
      ]
    })
    .compileComponents();

    mockWidgetOne = {
      widgetTitle: 'Mock Widget One',
      widgetTag: 'mock-widget-one',
      widgetBootstrap: '',
      docId: 'mock-widget-one-id'
    }
    mockAppOne = {
      appTitle: 'Mock App One',
      native: true,
      enabled: true,
      clientId: 'mock-client-one-id',
      clientName: 'Mock Client One',
      docId: 'mock-app-one-id',
      widgets: [ mockWidgetOne ]
    }
    defaultDashboard = {
      type: 'UserDashboard',
      title: 'New Dashboard',
      description: '',
      userId: mockUserId,
      gridItems: [],
      default: false
    }
    mockDashOne = {
      userId: mockUserId,
      default: true,
      docId: 'mock-dash-one-id',
      title: 'Mock Dash One',
      gridItems: [
        {
          parentAppId: 'mock-app-one-id',
          widgetId: 'mock-widget-one-id',
          gridsterItem: {x: 2, y: 2, cols: 0, rows: 0}
        }
      ]
    }

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dashSvc = fixture.debugElement.injector.get(DashboardService);
    optionsEl = fixture.debugElement.query(By.css('app-dashboard-options')).nativeElement;
  }));


  /**************************************************************************************
   *                                 COMPONENT TESTING
   **************************************************************************************/
  //Test Creation
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Test enterEditMode()
  it('should enter edit mode and store a copy of the current dashboard in tempDashboard', async(() => {
    expect(component.editMode).toBe(false);
    expect(component.tempDashboard).toEqual(defaultDashboard);
    component.enterEditMode();
    expect(component.editMode).toBe(true);
    expect(component.tempDashboard).toEqual(mockDashOne);
  }));

  //Test leaveEditMode()
  it('should leave edit mode while persisting changes to the current dashboard model', async(() => {
    fixture.detectChanges();
    component.editMode = true;
    component.userDashboards = [{
      userId: mockUserId,
      default: true,
      docId: 'mock-dash-one-id',
      gridItems: [
        {
          parentAppId: 'mock-app-one-id',
          widgetId: 'mock-widget-one-id',
          gridsterItem: {x: 0, y: 0, cols: 0, rows: 0}
        }
      ]
    }];
    component.tempDashboard = {
      userId: mockUserId,
      default: true,
      docId: 'mock-dash-one-id',
      gridItems: [
        {
          parentAppId: 'mock-app-one-id',
          widgetId: 'mock-widget-one-id',
          gridsterItem: {x: 0, y: 0, cols: 0, rows: 0}
        }
      ]
    };
    component.userDashboards[0].title = "Change Successful";
    component.leaveEditMode(true);
    expect(component.editMode).toBe(false);
    expect(component.userDashboards[0].title).toBe('Change Successful');
  }));

  it('should leave edit mode while rolling back changes to the current dashboard model', async(() => {
    fixture.detectChanges();
    component.editMode = true;
    component.userDashboards = [{
      userId: mockUserId,
      default: true,
      docId: 'mock-dash-one-id',
      title: 'Mock Dash One',
      gridItems: [
        {
          parentAppId: 'mock-app-one-id',
          widgetId: 'mock-widget-one-id',
          gridsterItem: {x: 0, y: 0, cols: 0, rows: 0}
        }
      ]
    }];
    component.tempDashboard = {
      userId: mockUserId,
      default: true,
      docId: 'mock-dash-one-id',
      title: 'Mock Dash One',
      gridItems: [
        {
          parentAppId: 'mock-app-one-id',
          widgetId: 'mock-widget-one-id',
          gridsterItem: {x: 0, y: 0, cols: 0, rows: 0}
        }
      ]
    };
    component.userDashboards[0].title = "Changed Title";
    component.leaveEditMode(false);
    expect(component.editMode).toBe(false);
    expect(component.userDashboards[0].title).toBe('Mock Dash One')
  }));

  //Test setDashboard()
  it('should update the dashIndex to be 0 and should set the activeDashId in dashSvcStub to be check-id-storage', async(() => {
    component.userDashboards = [ defaultDashboard, mockDashOne ];
    component.userDashboards[0].docId = 'check-id-storage';
    component.dashIndex = 1;
    component.setDashboard(0);
    expect(component.dashIndex).toBe(0);
    expect(component.userDashboards[component.dashIndex].docId).toBe('check-id-storage');
    expect(dashSvc.activeDashboardId).toBe('check-id-storage');
  }));

  it('should update the dashIndex to be 1 and should set the activeDashId in dashSvcStub to be check-id-storage', async(() => {
    component.userDashboards = [ defaultDashboard, mockDashOne ];
    component.userDashboards[1].docId = 'check-id-storage';
    component.dashIndex = 0;
    component.setDashboard(1);
    expect(component.dashIndex).toBe(1);
    expect(component.userDashboards[component.dashIndex].docId).toBe('check-id-storage');
    expect(dashSvc.activeDashboardId).toBe('check-id-storage');
  }));

  it('should have no effect on the value of dashIndex or the value of activeDashId in dashSvcStub', async(() => {
    component.userDashboards = [ defaultDashboard, mockDashOne ];
    component.userDashboards[0].docId = 'check-id-storage';
    component.dashIndex = 0;
    component.setDashboard(0);
    component.setDashboard(88);
    expect(component.dashIndex).toBe(0);
    expect(component.userDashboards[component.dashIndex].docId).toBe('check-id-storage');
    expect(dashSvc.activeDashboardId).toBe('check-id-storage');
  }));

  it('should have no effect on the value of dashIndex or the value of activeDashId in dashSvcStub', async(() => {
    component.userDashboards = [ defaultDashboard, mockDashOne ];
    component.userDashboards[0].docId = 'check-id-storage';
    component.dashIndex = 0;
    component.setDashboard(0);
    component.setDashboard(-1);
    expect(component.dashIndex).toBe(0);
    expect(component.userDashboards[component.dashIndex].docId).toBe('check-id-storage');
    expect(dashSvc.activeDashboardId).toBe('check-id-storage');
  }));

  //Test addWidget();
  it('should add a new WidgetGridItem to the dashboard', async(() => {
    component.userDashboards = [ mockDashOne ];
    component.dashIndex = 0;
    component.addWidget(mockAppOne, mockWidgetOne);
    let wgi = mockDashOne.gridItems[0];
    expect(component.userDashboards[component.dashIndex].gridItems.length).toBe(2);
    expect(component.userDashboards[component.dashIndex].gridItems[0]).toEqual(wgi);
  }));



  /**************************************************************************************
   *                                   TEMPLATE TESTING
   **************************************************************************************/
  it('should propogate changes to userDashboards into DashboardOptionsComponent', async(() => {
    let dashboardOptionsUserDashboards: Array<UserDashboard>;
    
    dashboardOptionsUserDashboards = JSON.parse(optionsEl.getAttribute('user-dashboards-test'));
    expect(dashboardOptionsUserDashboards.length).toEqual(component.userDashboards.length);
    for(let i = 0; i < component.userDashboards.length; i++){
      expect(dashboardOptionsUserDashboards[i]).toEqual(component.userDashboards[i]);
    }
    
    component.userDashboards = [mockDashOne, mockDashOne, mockDashOne];
    fixture.detectChanges();
    dashboardOptionsUserDashboards = JSON.parse(optionsEl.getAttribute('user-dashboards-test'));

    expect(dashboardOptionsUserDashboards.length).toEqual(component.userDashboards.length);
    for(let i = 0; i < component.userDashboards.length; i++){
      expect(dashboardOptionsUserDashboards[i]).toEqual(component.userDashboards[i]);
    }
  }));

  it('should propogate changes to the active dashboard model into DashboardOptions and DashboardGridster', async(() => {
    let dashboardOptionsDash: UserDashboard;
    let dashboardGridsterDash: UserDashboard;
    
    component.userDashboards = [ mockDashOne ];
    fixture.detectChanges();
    dashboardOptionsDash = JSON.parse(optionsEl.getAttribute('user-dashboards-test'))[0];
    dashboardGridsterDash = component.dashboardGridsterComponent.dashboard;
    expect(dashboardOptionsDash).toEqual(component.userDashboards[0]);
    expect(dashboardGridsterDash).toEqual(component.userDashboards[0]);

    component.userDashboards = [ defaultDashboard ];
    fixture.detectChanges();
    dashboardOptionsDash = JSON.parse(optionsEl.getAttribute('user-dashboards-test'))[0];
    dashboardGridsterDash = component.dashboardGridsterComponent.dashboard;
    expect(dashboardOptionsDash).toEqual(component.userDashboards[0]);
    expect(dashboardGridsterDash).toEqual(component.userDashboards[0]);
  }));

  it('should change the active dashboard in child components when setDashboard is called', async(() => {
    let dashboardOptionsDashIndex: string;
    let dashboardOptionsUserDashboards: Array<UserDashboard>;
    let dashboardGridsterDash: UserDashboard;
    
    component.userDashboards = [ defaultDashboard, mockDashOne ];
    component.dashIndex = 0;
    fixture.detectChanges();
    dashboardOptionsDashIndex = optionsEl.getAttribute('ng-reflect-dash-index');
    dashboardOptionsUserDashboards = JSON.parse(optionsEl.getAttribute('user-dashboards-test'));
    dashboardGridsterDash = component.dashboardGridsterComponent.dashboard;
    expect(dashboardOptionsDashIndex).toBe('0');
    expect(dashboardOptionsUserDashboards[dashboardOptionsDashIndex]).toEqual(component.userDashboards[component.dashIndex]);
    expect(dashboardGridsterDash).toEqual(component.userDashboards[component.dashIndex]);

    component.setDashboard(1);
    fixture.detectChanges();
    dashboardOptionsDashIndex = optionsEl.getAttribute('ng-reflect-dash-index');
    dashboardOptionsUserDashboards = JSON.parse(optionsEl.getAttribute('user-dashboards-test'));
    dashboardGridsterDash = component.dashboardGridsterComponent.dashboard;
    expect(dashboardOptionsDashIndex).toBe('1');
    expect(dashboardOptionsUserDashboards[dashboardOptionsDashIndex]).toEqual(component.userDashboards[component.dashIndex]);
    expect(dashboardGridsterDash).toEqual(component.userDashboards[component.dashIndex]);
  }));

  it('should toggle the editMode value in DashboardOptions and DashboardGridster', async(() => {
    let dashboardGridster: DashboardGridsterComponentStub = component.dashboardGridsterComponent;

    component.editMode = false;
    fixture.detectChanges();
    expect(optionsEl.getAttribute('ng-reflect-edit-mode')).toBe('false');
    expect(dashboardGridster.editMode).toBe(false);

    component.editMode = true;
    fixture.detectChanges();
    expect(optionsEl.getAttribute('ng-reflect-edit-mode')).toBe('true');
    expect(dashboardGridster.editMode).toBe(true);

    component.editMode = false;
    fixture.detectChanges();
    expect(optionsEl.getAttribute('ng-reflect-edit-mode')).toBe('false');
    expect(dashboardGridster.editMode).toBe(false);
  }));

  it('should propogate changes to dashIndex into DashboardOptions', async(() => {
    component.userDashboards = [ mockDashOne, mockDashOne, mockDashOne ];

    component.dashIndex = 0;
    fixture.detectChanges();
    expect(optionsEl.getAttribute('ng-reflect-dash-index')).toBe('0');
    
    component.dashIndex = 1;
    fixture.detectChanges();
    expect(optionsEl.getAttribute('ng-reflect-dash-index')).toBe('1');
  }));
  
  it('should trigger a change in dashIndex in response to a setDashboard event from DashboardOptions', async(() => {
    component.userDashboards = [ defaultDashboard, mockDashOne ];
    component.dashIndex = 0;
    fixture.detectChanges();
    expect(component.dashIndex).toBe(0);

    fixture.debugElement.query(By.css('app-dashboard-options')).triggerEventHandler('setDashboard', 1);
    expect(component.dashIndex).toBe(1);
  }));

  it('should trigger a change in dashIndex in response to a setDashboard event from DashboardOptions', async(() => {
    component.userDashboards = [ defaultDashboard, mockDashOne ];
    component.dashIndex = 0;
    fixture.detectChanges();
    expect(component.dashIndex).toBe(0);

    fixture.debugElement.query(By.css('app-dashboard-options')).triggerEventHandler('setDashboard', 1);
    expect(component.dashIndex).toBe(1);
  }));

  it('should trigger a change in dashIndex in response to a setDashboard event from DashboardOptions', async(() => {
    component.userDashboards = [ defaultDashboard, mockDashOne ];
    component.dashIndex = 0;
    fixture.detectChanges();
    expect(component.dashIndex).toBe(0);

    fixture.debugElement.query(By.css('app-dashboard-options')).triggerEventHandler('setDashboard', 1);
    expect(component.dashIndex).toBe(1);
  }));

  it('should make editMode true when DashboardOptions emits an enterEditMode event', async(() => {
    component.editMode = false;
    fixture.detectChanges();
    expect(component.dashIndex).toBe(0);

    fixture.debugElement.query(By.css('app-dashboard-options')).triggerEventHandler('enterEditMode', null);
    expect(component.editMode).toBe(true);
  }));

  it('should make editMode false when DashboardOptions emits a leaveEditMode event', async(() => {
    component.editMode = true;
    fixture.detectChanges();
    expect(component.dashIndex).toBe(0);

    fixture.debugElement.query(By.css('app-dashboard-options')).triggerEventHandler('leaveEditMode', true);
    expect(component.editMode).toBe(false);

    component.editMode = true;
    fixture.detectChanges();
    expect(component.dashIndex).toBe(0);

    fixture.debugElement.query(By.css('app-dashboard-options')).triggerEventHandler('leaveEditMode', false);
    expect(component.editMode).toBe(false);
  }));
});
