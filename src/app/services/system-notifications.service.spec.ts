import { TestBed } from '@angular/core/testing';

import { SystemNotificationsService } from './system-notifications.service';

describe('SystemNotificationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SystemNotificationsService = TestBed.get(SystemNotificationsService);
    expect(service).toBeTruthy();
  });
});
