import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationManualComponent } from './registration-manual.component';

describe('RegistrationManualComponent', () => {
  let component: RegistrationManualComponent;
  let fixture: ComponentFixture<RegistrationManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationManualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
