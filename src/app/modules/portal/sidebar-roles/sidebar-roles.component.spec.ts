import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarRolesComponent } from './sidebar-roles.component';

describe('SidebarRolesComponent', () => {
  let component: SidebarRolesComponent;
  let fixture: ComponentFixture<SidebarRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
