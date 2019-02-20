import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNativeAppsComponent } from './list-native-apps.component';

describe('ListNativeAppsComponent', () => {
  let component: ListNativeAppsComponent;
  let fixture: ComponentFixture<ListNativeAppsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListNativeAppsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNativeAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
