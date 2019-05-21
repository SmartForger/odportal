import { TestBed } from '@angular/core/testing';

import { FeedbackWidgetService } from './feedback-widget.service';

describe('FeedbackWidgetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FeedbackWidgetService = TestBed.get(FeedbackWidgetService);
    expect(service).toBeTruthy();
  });
});
