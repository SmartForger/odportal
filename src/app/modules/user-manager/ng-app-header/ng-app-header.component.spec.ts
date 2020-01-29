import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgAppHeaderComponent } from './ng-app-header.component';

describe('NgAppHeaderComponent', () => {
  let component: NgAppHeaderComponent;
  let fixture: ComponentFixture<NgAppHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgAppHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgAppHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
