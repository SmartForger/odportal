import { TestBed } from '@angular/core/testing';

import { DashboardTemplateService } from './dashboard-template.service';

describe('DashboardTemplateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboardTemplateService = TestBed.get(DashboardTemplateService);
    expect(service).toBeTruthy();
  });
});
