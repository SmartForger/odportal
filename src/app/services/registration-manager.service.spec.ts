import { TestBed } from '@angular/core/testing';

import { RegistrationManagerService } from './registration-manager.service';

describe('RegistrationManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegistrationManagerService = TestBed.get(RegistrationManagerService);
    expect(service).toBeTruthy();
  });
});
