import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTrackingConfigComponent } from './session-tracking-config.component';

describe('SessionTrackingConfigComponent', () => {
  let component: SessionTrackingConfigComponent;
  let fixture: ComponentFixture<SessionTrackingConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionTrackingConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionTrackingConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
