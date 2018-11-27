import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreServicesConfigFormComponent } from './core-services-config-form.component';

describe('CoreServicesConfigFormComponent', () => {
  let component: CoreServicesConfigFormComponent;
  let fixture: ComponentFixture<CoreServicesConfigFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoreServicesConfigFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreServicesConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
