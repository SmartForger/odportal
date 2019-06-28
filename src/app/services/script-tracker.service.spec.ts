import { TestBed } from '@angular/core/testing';

import { ScriptTrackerService } from './script-tracker.service';

describe('ScriptTrackerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScriptTrackerService = TestBed.get(ScriptTrackerService);
    expect(service).toBeTruthy();
  });
});
