import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgRoleMappingsComponent } from './ng-role-mappings.component';

describe('NgRoleMappingsComponent', () => {
  let component: NgRoleMappingsComponent;
  let fixture: ComponentFixture<NgRoleMappingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgRoleMappingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgRoleMappingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
