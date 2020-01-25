import { TestBed } from '@angular/core/testing';

import { QueryParameterCollectorService } from './query-parameter-collector.service';

describe('QueryParameterCollectorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QueryParameterCollectorService = TestBed.get(QueryParameterCollectorService);
    expect(service).toBeTruthy();
  });
});
