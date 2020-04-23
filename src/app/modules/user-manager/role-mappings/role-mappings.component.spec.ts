import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleMappingsComponent } from './role-mappings.component';

describe('RoleMappingsComponent', () => {
  let component: RoleMappingsComponent;
  let fixture: ComponentFixture<RoleMappingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleMappingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleMappingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
