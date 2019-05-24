import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveSessionsFilterComponent } from './active-sessions-filter.component';

describe('ActiveSessionsFilterComponent', () => {
  let component: ActiveSessionsFilterComponent;
  let fixture: ComponentFixture<ActiveSessionsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveSessionsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveSessionsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
