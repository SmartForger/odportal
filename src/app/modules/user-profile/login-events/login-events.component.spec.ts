import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginEventsComponent } from './login-events.component';

describe('LoginEventsComponent', () => {
  let component: LoginEventsComponent;
  let fixture: ComponentFixture<LoginEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
