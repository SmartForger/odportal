import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgUserManagerComponent } from './ng-user-manager.component';

describe('NgUserManagerComponent', () => {
  let component: NgUserManagerComponent;
  let fixture: ComponentFixture<NgUserManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgUserManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgUserManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
