import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAppsActiveComponent } from './list-apps-active.component';

describe('ListAppsActiveComponent', () => {
  let component: ListAppsActiveComponent;
  let fixture: ComponentFixture<ListAppsActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAppsActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAppsActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
