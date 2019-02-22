import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppClientRolesComponent } from './edit-app-client-roles.component';

describe('EditAppClientRolesComponent', () => {
  let component: EditAppClientRolesComponent;
  let fixture: ComponentFixture<EditAppClientRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAppClientRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppClientRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
