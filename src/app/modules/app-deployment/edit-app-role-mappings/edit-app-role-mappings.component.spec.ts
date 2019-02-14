import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppRoleMappingsComponent } from './edit-app-role-mappings.component';

describe('EditAppRoleMappingsComponent', () => {
  let component: EditAppRoleMappingsComponent;
  let fixture: ComponentFixture<EditAppRoleMappingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAppRoleMappingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppRoleMappingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
