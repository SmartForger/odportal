import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPendingUsersComponent } from './list-pending-users.component';

describe('ListPendingUsersComponent', () => {
  let component: ListPendingUsersComponent;
  let fixture: ComponentFixture<ListPendingUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPendingUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPendingUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
