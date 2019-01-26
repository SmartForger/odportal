import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsoAdminCredsFormComponent } from './sso-admin-creds-form.component';

describe('SsoAdminCredsFormComponent', () => {
  let component: SsoAdminCredsFormComponent;
  let fixture: ComponentFixture<SsoAdminCredsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SsoAdminCredsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsoAdminCredsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
