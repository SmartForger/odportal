import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleMapperComponent } from './role-mapper.component';

describe('RoleMapperComponent', () => {
  let component: RoleMapperComponent;
  let fixture: ComponentFixture<RoleMapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleMapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleMapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
