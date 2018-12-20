import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleConfigFormComponent } from './role-config-form.component';

describe('RoleConfigFormComponent', () => {
  let component: RoleConfigFormComponent;
  let fixture: ComponentFixture<RoleConfigFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleConfigFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
