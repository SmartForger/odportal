import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDetailsModalComponent } from './dashboard-details-modal.component';

describe('DashboardDetailsModalComponent', () => {
  let component: DashboardDetailsModalComponent;
  let fixture: ComponentFixture<DashboardDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
