import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtpRelayComponent } from './smtp-relay.component';

describe('SmtpRelayComponent', () => {
  let component: SmtpRelayComponent;
  let fixture: ComponentFixture<SmtpRelayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmtpRelayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtpRelayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
