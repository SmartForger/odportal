import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgTitleIconBlockComponent } from './ng-title-icon-block.component';

describe('NgTitleIconBlockComponent', () => {
  let component: NgTitleIconBlockComponent;
  let fixture: ComponentFixture<NgTitleIconBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgTitleIconBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgTitleIconBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
