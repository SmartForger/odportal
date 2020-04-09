import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgSimspaceComponent } from './ng-simspace.component';

describe('NgSimspaceComponent', () => {
  let component: NgSimspaceComponent;
  let fixture: ComponentFixture<NgSimspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgSimspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgSimspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
