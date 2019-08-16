import { TestBed } from '@angular/core/testing';

import { WidgetHotbarService } from './widget-hotbar.service';

describe('WidgetHotbarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WidgetHotbarService = TestBed.get(WidgetHotbarService);
    expect(service).toBeTruthy();
  });
});
