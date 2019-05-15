import { TestBed } from '@angular/core/testing';

import { SharedWidgetCacheService } from './shared-widget-cache.service';

describe('SharedWidgetCacheService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedWidgetCacheService = TestBed.get(SharedWidgetCacheService);
    expect(service).toBeTruthy();
  });
});
