import { TestBed } from '@angular/core/testing';

import { RegistrationAccountService } from './registration-account.service';

describe('RegistrationAccountService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegistrationAccountService = TestBed.get(RegistrationAccountService);
    expect(service).toBeTruthy();
  });
});
