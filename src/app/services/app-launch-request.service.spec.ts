import { TestBed } from '@angular/core/testing';

import { AppLaunchRequestService } from './app-launch-request.service';

describe('AppLaunchRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppLaunchRequestService = TestBed.get(AppLaunchRequestService);
    expect(service).toBeTruthy();
  });
});
