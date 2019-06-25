import { TestBed } from '@angular/core/testing';

import { RegistrationFilesService } from './registration-files.service';

describe('RegistrationFilesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegistrationFilesService = TestBed.get(RegistrationFilesService);
    expect(service).toBeTruthy();
  });
});
