/**
 * @description Manages options for the user dashboard: set title, set description, choose active dashboard, edit/delete options, etc.
 * @author James Marcu
 */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { MatDialog } from '@angular/material';

import { MaterialModule } from '../../../material.module';
import { FormElementsModule } from '../../form-elements/form-elements.module';
import { AuthService } from 'src/app/services/auth.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { DashboardOptionsComponent } from './dashboard-options.component';
import { UserDashboard } from 'src/app/models/user-dashboard.model';
import { DashboardDetailsModalComponent } from '../dashboard-details-modal/dashboard-details-modal.component';

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

describe('DashboardOptionsComponent', () => {
  let component: DashboardOptionsComponent;
  let fixture: ComponentFixture<DashboardOptionsComponent>;
  let mockUserId: string;
  let defaultDash: UserDashboard;
  let mockDashOne: UserDashboard;
  let mockDashTwo: UserDashboard;
  let mockDashThree: UserDashboard;
  
  let authSvcStub: Partial<AuthService> = {};
  authSvcStub.getUserId = () => {return mockUserId;};
  let dashSvcStub: Partial<DashboardService> = {};
  dashSvcStub.addDashboard = (dash: UserDashboard) => {return of(dash);};
  dashSvcStub.deleteDashboard = (dashId: string) => {return of(mockDashOne)};
  dashSvcStub.setDefaultDashboard = (dashId: string) => { return of(mockDashOne)};
  let dialog: MatDialogMock;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        DashboardOptionsComponent
      ],
      imports: [ 
        MaterialModule, 
        FormsModule, 
        ReactiveFormsModule,
        FormElementsModule,
        BrowserAnimationsModule
      ],
      providers: [
        {provide: MatDialog, useClass: MatDialogMock},
        {provide: AuthService, useValue: authSvcStub},
        {provide: DashboardService, useValue: dashSvcStub}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardOptionsComponent);
    component = fixture.componentInstance;
    mockUserId = 'fake-user-id';
    defaultDash = {
      type: 'UserDashboard',
      title: 'New Dashboard',
      description: '',
      userId: mockUserId,
      gridItems: [],
      default: false
    }
    mockDashOne = {
      userId: mockUserId,
      gridItems: [],
      default: true,
      title: 'Mock Dash One',
      description: 'The first mock dashboard.',
      docId: 'mock-dash-one-id'
    };
    mockDashTwo = {
      userId: mockUserId,
      gridItems: [],
      default: false,
      title: 'Mock Dash Two',
      description: 'The second mock dashboard.',
      docId: 'mock-dash-two-id'
    };
    mockDashThree = {
      userId: mockUserId,
      gridItems: [],
      default: false,
      title: 'Mock Dash Three',
      description: 'The third mock dashboard.',
      docId: 'mock-dash-three-id'
    };
    
    component.ngOnInit();
    component.userDashboards = [ mockDashOne, mockDashTwo, mockDashThree ];
    component.dashIndex = 0;
    component.editMode = false;
    fixture.detectChanges();
  }));

  beforeEach(() => {
    dialog = TestBed.get(MatDialog);
    dialog.mdr = new MatDialogRef();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create modal to set dashboard details, pass in the current details to that modal, and read out the details after the modal is closed', async(() => {
    dialog.mdr = {
      componentInstance: {
        dashTitle: '',
        dashDescription: '',
        details: new Subject<{title: string, description: string}>()
      },
      close: () => {}
    };
    let openSpy = spyOn(dialog, 'open').and.callThrough();
    let closeSpy = spyOn(dialog.mdr, 'close').and.callThrough();

    component.setDashboardDetails();

    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(dialog.mdr.componentInstance.dashTitle).toBe(component.userDashboards[component.dashIndex].title);
    expect(dialog.mdr.componentInstance.dashDescription).toBe(component.userDashboards[component.dashIndex].description);

    dialog.mdr.componentInstance.details.next({title: 'New Title', description: 'New Description'});

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(component.userDashboards[component.dashIndex].title).toBe('New Title');
    expect(component.userDashboards[component.dashIndex].description).toBe('New Description');
  }));

  it('should create a new dashboard, add it to userDashboards, emit a signal to set the new dashboard as active, emit a signal to enter edit mode, then call setDashboardDetails', async(() => {
    let setDashboardDetailsOverride = spyOn(component, 'setDashboardDetails').and.callFake(() => {});
    let createDefaultDashboardOverride = spyOn(UserDashboard, 'createDefaultDashboard').and.callFake(() => {
      return defaultDash;
    });
    let setDashboardSpy = spyOn(component.setDashboard, 'emit').and.callFake((index: number) => {
      expect(index).toEqual(3);
    });
    let enterEditModeSpy = spyOn(component.enterEditMode, 'emit').and.callFake(() => {});

    component.createNewDashboard();

    expect(component.userDashboards.length).toBe(4);
    expect(component.userDashboards[3]).toEqual(defaultDash);
    expect(setDashboardSpy).toHaveBeenCalledTimes(1);
    expect(enterEditModeSpy).toHaveBeenCalledTimes(1);
    expect(setDashboardDetailsOverride).toHaveBeenCalledTimes(1);
  }));

  it('should open a modal to confirm dashboard deletion, and should populate the modals fields properly', async(() => {
    dialog.mdr = {
      componentInstance: {
        title: '',
        message: '',
        icons: [],
        buttons: [],
        btnClick: new Subject<string>()
      },
      close: () => {}
    };
    let spy = spyOn(dialog, 'open').and.callThrough();

    component.deleteDashboard();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(dialog.mdr.componentInstance.title).toBe('Delete Dashboard');
    expect(dialog.mdr.componentInstance.message).toBe('Are you sure you want to delete ' + component.userDashboards[component.dashIndex].title + ' from your dashboards?');
    expect(dialog.mdr.componentInstance.icons).toEqual([{icon: 'dashboard', classList: ''}]);
    expect(dialog.mdr.componentInstance.buttons).toEqual([{title: 'Delete', classList: 'bg-red'}]);
  }));

  it('should have no effect on userDashboards if the user does not confirm deletion', async(() => {
    dialog.mdr = {
      componentInstance: {
        title: '',
        message: '',
        icons: [],
        buttons: [],
        btnClick: new Subject<string>()
      },
      close: () => {}
    };

    component.deleteDashboard();
    dialog.mdr.componentInstance.btnClick.next('Cancel');
    let spy = spyOn(fixture.debugElement.injector.get(DashboardService), 'deleteDashboard');

    expect(component.userDashboards).toEqual([ mockDashOne, mockDashTwo, mockDashThree ]);
    expect(spy).toHaveBeenCalledTimes(0);
  }));

  it('should delete the specified dashboard locally in the component, and call DashboardService to remove it from the backend', async(() => {
    dialog.mdr = {
      componentInstance: {
        title: '',
        message: '',
        icons: [],
        buttons: [],
        btnClick: new Subject<string>()
      },
      close: () => {}
    };
    let spy = spyOn(fixture.debugElement.injector.get(DashboardService), 'deleteDashboard').and.callFake(() => {
      return of(mockDashOne);
    });

    component.deleteDashboard();
    dialog.mdr.componentInstance.btnClick.next('Delete');

    expect(component.userDashboards).toEqual([ mockDashTwo, mockDashThree ]);
    expect(spy).toHaveBeenCalledTimes(1);
  }));

  it('should emit an event to switch dashIndex after deletion, and account for the current dashIndex not being valid', async(() => {
    dialog.mdr = {
      componentInstance: {
        title: '',
        message: '',
        icons: [],
        buttons: [],
        btnClick: new Subject<string>()
      },
      close: () => {}
    };
    let spy = spyOn(component.setDashboard, 'emit').and.callFake((index: number) => {
      expect(index).toBe(0);
    });
    component.deleteDashboard();
    dialog.mdr.componentInstance.btnClick.next('Delete');
    expect(spy).toHaveBeenCalledTimes(1);

    component.dashIndex = 1;
    fixture.detectChanges();
    component.deleteDashboard();
    expect(spy).toHaveBeenCalledTimes(1);
  }));

  it('should call out to DashboardService to the current dashboard as the default', async(() => {
    component.dashIndex = 1;
    let spy = spyOn(fixture.debugElement.injector.get(DashboardService), 'setDefaultDashboard').and.callThrough();
    component.setDefault();
    expect(spy).toHaveBeenCalledTimes(1);
  }));

  it('should open a WidgetModalComponent, then close', async(() => {
    dialog.mdr = {
      componentInstance: {
        close: new Subject<void>()
      },
      close: () => {}
    }
    let openSpy = spyOn(dialog, 'open').and.callThrough();
    let closeSpy = spyOn(dialog.mdr, 'close').and.callThrough();
    component.addWidget();

    expect(openSpy).toHaveBeenCalledTimes(1);

    dialog.mdr.componentInstance.close.next();

    expect(closeSpy).toHaveBeenCalledTimes(1);
  }));
});
