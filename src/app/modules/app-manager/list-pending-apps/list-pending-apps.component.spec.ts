import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPendingAppsComponent } from './list-pending-apps.component';

describe('ListPendingAppsComponent', () => {
  let component: ListPendingAppsComponent;
  let fixture: ComponentFixture<ListPendingAppsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPendingAppsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPendingAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
