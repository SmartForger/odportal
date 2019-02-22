import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWidgetsComponent } from './view-widgets.component';

describe('ViewWidgetsComponent', () => {
  let component: ViewWidgetsComponent;
  let fixture: ComponentFixture<ViewWidgetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewWidgetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
