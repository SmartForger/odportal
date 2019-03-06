import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGridsterComponent } from './dashboard-gridster.component';

describe('DashboardGridsterComponent', () => {
  let component: DashboardGridsterComponent;
  let fixture: ComponentFixture<DashboardGridsterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardGridsterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardGridsterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
