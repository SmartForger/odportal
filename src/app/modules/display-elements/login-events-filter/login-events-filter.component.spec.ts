import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginEventsFilterComponent } from './login-events-filter.component';

describe('LoginEventsFilterComponent', () => {
  let component: LoginEventsFilterComponent;
  let fixture: ComponentFixture<LoginEventsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginEventsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginEventsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
