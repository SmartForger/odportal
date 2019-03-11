import { TestBed } from '@angular/core/testing';

import { HttpRequestMonitorService } from './http-request-monitor.service';

describe('HttpRequestMonitorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpRequestMonitorService = TestBed.get(HttpRequestMonitorService);
    expect(service).toBeTruthy();
  });
});
