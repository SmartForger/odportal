import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListActiveUsersComponent } from './list-active-users.component';

describe('ListActiveUsersComponent', () => {
  let component: ListActiveUsersComponent;
  let fixture: ComponentFixture<ListActiveUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListActiveUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListActiveUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
