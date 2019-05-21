import { TestBed } from '@angular/core/testing';

import { SessionTrackingServiceService } from './session-tracking-service.service';

describe('SessionTrackingServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SessionTrackingServiceService = TestBed.get(SessionTrackingServiceService);
    expect(service).toBeTruthy();
  });
});
