import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalNotificationsTableComponent } from './total-notifications-table.component';

describe('TotalNotificationsTableComponent', () => {
  let component: TotalNotificationsTableComponent;
  let fixture: ComponentFixture<TotalNotificationsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalNotificationsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalNotificationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
