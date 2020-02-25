import { TestBed } from '@angular/core/testing';

import { EnvironmentsServiceService } from './environments-service.service';

describe('EnvironmentsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnvironmentsServiceService = TestBed.get(EnvironmentsServiceService);
    expect(service).toBeTruthy();
  });
});
