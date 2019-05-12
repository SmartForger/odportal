import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEventsFilterComponent } from './admin-events-filter.component';

describe('AdminEventsFilterComponent', () => {
  let component: AdminEventsFilterComponent;
  let fixture: ComponentFixture<AdminEventsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEventsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEventsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
