import { TestBed, async } from '@angular/core/testing';

import { UserSettingsService } from './user-settings.service';

describe('UserSettingsService', () => {
  let service: UserSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.get(UserSettingsService);
  });

  it('should be created', () => {
    const service: UserSettingsService = TestBed.get(UserSettingsService);
    expect(service).toBeTruthy();
  });

  it('should observe changes regarding showing the navigation with a subscription', async(() => {
    service.observeShowNavigationUpdated().subscribe(
      (show: boolean) => {
        expect(show).toBe(true);
      }
    );
    service.setShowNavigation(true);
  }));
});
