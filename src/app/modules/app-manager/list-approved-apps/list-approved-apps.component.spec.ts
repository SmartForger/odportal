import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListApprovedAppsComponent } from './list-approved-apps.component';

describe('ListApprovedAppsComponent', () => {
  let component: ListApprovedAppsComponent;
  let fixture: ComponentFixture<ListApprovedAppsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListApprovedAppsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListApprovedAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
