import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SandboxHttpRequestTrackerComponent } from './sandbox-http-request-tracker.component';

describe('SandboxHttpRequestTrackerComponent', () => {
  let component: SandboxHttpRequestTrackerComponent;
  let fixture: ComponentFixture<SandboxHttpRequestTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SandboxHttpRequestTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SandboxHttpRequestTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
