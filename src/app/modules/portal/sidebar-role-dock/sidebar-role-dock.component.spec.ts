import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarRoleDockComponent } from './sidebar-role-dock.component';

describe('SidebarRoleDockComponent', () => {
  let component: SidebarRoleDockComponent;
  let fixture: ComponentFixture<SidebarRoleDockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarRoleDockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarRoleDockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
