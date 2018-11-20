import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarWidgetDockComponent } from './sidebar-widget-dock.component';

describe('SidebarWidgetDockComponent', () => {
  let component: SidebarWidgetDockComponent;
  let fixture: ComponentFixture<SidebarWidgetDockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarWidgetDockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarWidgetDockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
