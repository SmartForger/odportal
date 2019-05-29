import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationBasicInfoComponent } from './registration-basic-info.component';

describe('RegistrationBasicInfoComponent', () => {
  let component: RegistrationBasicInfoComponent;
  let fixture: ComponentFixture<RegistrationBasicInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationBasicInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
