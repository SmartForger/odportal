import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAppsPendingComponent } from './list-apps-pending.component';

describe('ListAppsPendingComponent', () => {
  let component: ListAppsPendingComponent;
  let fixture: ComponentFixture<ListAppsPendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAppsPendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAppsPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
