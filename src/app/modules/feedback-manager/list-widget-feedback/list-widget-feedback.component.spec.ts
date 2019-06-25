import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWidgetFeedbackComponent } from './list-widget-feedback.component';

describe('ListWidgetFeedbackComponent', () => {
  let component: ListWidgetFeedbackComponent;
  let fixture: ComponentFixture<ListWidgetFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListWidgetFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWidgetFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
