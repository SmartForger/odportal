import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgSelectMenuComponent } from './ng-select-menu.component';

describe('NgSelectMenuComponent', () => {
  let component: NgSelectMenuComponent;
  let fixture: ComponentFixture<NgSelectMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgSelectMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgSelectMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
