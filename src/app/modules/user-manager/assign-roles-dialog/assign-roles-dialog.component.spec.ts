import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignRolesDialogComponent } from './assign-roles-dialog.component';

describe('AssignRolesDialogComponent', () => {
  let component: AssignRolesDialogComponent;
  let fixture: ComponentFixture<AssignRolesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignRolesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignRolesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
