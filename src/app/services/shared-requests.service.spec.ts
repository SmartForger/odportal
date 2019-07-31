import { TestBed } from '@angular/core/testing';

import { SharedRequestsService } from './shared-requests.service';

describe('ExternalRequestsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedRequestsService = TestBed.get(SharedRequestsService);
    expect(service).toBeTruthy();
  });
});
