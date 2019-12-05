import { TestBed } from '@angular/core/testing';

import { SimspaceHardcodeService } from './simspace-hardcode.service';

describe('SimspaceHardcodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SimspaceHardcodeService = TestBed.get(SimspaceHardcodeService);
    expect(service).toBeTruthy();
  });
});
