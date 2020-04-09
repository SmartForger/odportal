import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgCeusComponent } from './ng-ceus.component';

describe('NgCeusComponent', () => {
  let component: NgCeusComponent;
  let fixture: ComponentFixture<NgCeusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgCeusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgCeusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
