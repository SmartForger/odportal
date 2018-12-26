import { TestBed } from '@angular/core/testing';

import { AjaxProgressService } from './ajax-progress.service';

describe('AjaxProgressService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AjaxProgressService = TestBed.get(AjaxProgressService);
    expect(service).toBeTruthy();
  });
});
