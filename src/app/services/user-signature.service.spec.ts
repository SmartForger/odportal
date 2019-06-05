import { TestBed } from '@angular/core/testing';

import { UserSignatureService } from './user-signature.service';

describe('UserSignatureService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserSignatureService = TestBed.get(UserSignatureService);
    expect(service).toBeTruthy();
  });
});
