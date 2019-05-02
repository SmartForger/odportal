import { TestBed } from '@angular/core/testing';

import { WidgetModalService } from './widget-modal.service';

describe('WidgetModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WidgetModalService = TestBed.get(WidgetModalService);
    expect(service).toBeTruthy();
  });
});
