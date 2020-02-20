import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgPageSidebarComponent } from './ng-page-sidebar.component';

describe('NgPageSidebarComponent', () => {
  let component: NgPageSidebarComponent;
  let fixture: ComponentFixture<NgPageSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgPageSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgPageSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
