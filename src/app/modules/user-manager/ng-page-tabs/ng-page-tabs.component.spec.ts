import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgPageTabsComponent } from './ng-page-tabs.component';

describe('NgPageTabsComponent', () => {
  let component: NgPageTabsComponent;
  let fixture: ComponentFixture<NgPageTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgPageTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgPageTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
