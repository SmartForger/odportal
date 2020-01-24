import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgSimpleTableComponent } from './ng-simple-table.component';

describe('NgSimpleTableComponent', () => {
  let component: NgSimpleTableComponent;
  let fixture: ComponentFixture<NgSimpleTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgSimpleTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgSimpleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
