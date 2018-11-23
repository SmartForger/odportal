import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupCoreServicesComponent } from './setup-core-services.component';

describe('SetupCoreServicesComponent', () => {
  let component: SetupCoreServicesComponent;
  let fixture: ComponentFixture<SetupCoreServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupCoreServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupCoreServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
