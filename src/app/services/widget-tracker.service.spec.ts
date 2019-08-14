import { TestBed } from '@angular/core/testing';

import { WidgetTrackerService } from './widget-tracker.service';

describe('WidgetTrackerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WidgetTrackerService = TestBed.get(WidgetTrackerService);
    expect(service).toBeTruthy();
  });
});
