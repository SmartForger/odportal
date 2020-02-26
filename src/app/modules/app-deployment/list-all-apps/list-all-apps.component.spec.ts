import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllAppsComponent } from './list-all-apps.component';

describe('ListAllAppsComponent', () => {
  let component: ListAllAppsComponent;
  let fixture: ComponentFixture<ListAllAppsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAllAppsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAllAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
