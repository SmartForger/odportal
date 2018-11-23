import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdminRoleComponent } from './create-admin-role.component';

describe('CreateAdminRoleComponent', () => {
  let component: CreateAdminRoleComponent;
  let fixture: ComponentFixture<CreateAdminRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAdminRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAdminRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
