import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationAccountTypeComponent } from './registration-account-type.component';

describe('RegistrationAccountTypeComponent', () => {
  let component: RegistrationAccountTypeComponent;
  let fixture: ComponentFixture<RegistrationAccountTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationAccountTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationAccountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
