import { TestBed } from '@angular/core/testing';

import { HttpRequestControllerService } from './http-request-controller.service';

describe('HttpRequestControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpRequestControllerService = TestBed.get(HttpRequestControllerService);
    expect(service).toBeTruthy();
  });
});
