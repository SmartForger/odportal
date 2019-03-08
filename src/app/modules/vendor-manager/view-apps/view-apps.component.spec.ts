import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAppsComponent } from './view-apps.component';

describe('ViewAppsComponent', () => {
  let component: ViewAppsComponent;
  let fixture: ComponentFixture<ViewAppsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAppsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
