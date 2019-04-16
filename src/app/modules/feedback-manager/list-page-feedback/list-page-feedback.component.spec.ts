import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPageFeedbackComponent } from './list-page-feedback.component';

describe('ListPageFeedbackComponent', () => {
  let component: ListPageFeedbackComponent;
  let fixture: ComponentFixture<ListPageFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPageFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPageFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
