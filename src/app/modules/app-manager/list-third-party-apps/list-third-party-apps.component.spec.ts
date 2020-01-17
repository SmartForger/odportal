import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListThirdPartyAppsComponent } from './list-third-party-apps.component';

describe('ListThirdPartyAppsComponent', () => {
  let component: ListThirdPartyAppsComponent;
  let fixture: ComponentFixture<ListThirdPartyAppsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListThirdPartyAppsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListThirdPartyAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
