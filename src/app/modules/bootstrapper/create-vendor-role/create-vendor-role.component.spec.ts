import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVendorRoleComponent } from './create-vendor-role.component';

describe('CreateVendorRoleComponent', () => {
  let component: CreateVendorRoleComponent;
  let fixture: ComponentFixture<CreateVendorRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateVendorRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVendorRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
