import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupAdminAccountComponent } from './setup-admin-account.component';

describe('SetupAdminAccountComponent', () => {
  let component: SetupAdminAccountComponent;
  let fixture: ComponentFixture<SetupAdminAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupAdminAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupAdminAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
