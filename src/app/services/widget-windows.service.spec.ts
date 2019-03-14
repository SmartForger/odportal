import { TestBed } from '@angular/core/testing';

import { WidgetWindowsService } from './widget-windows.service';

describe('WidgetWindowsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WidgetWindowsService = TestBed.get(WidgetWindowsService);
    expect(service).toBeTruthy();
  });
});
