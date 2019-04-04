import { TestBed } from '@angular/core/testing';

import { AjaxProgressService } from './ajax-progress.service';

describe('AjaxProgressService', () => {
  let service: AjaxProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.get(AjaxProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set isShown to true if route is not whitelisted', () => {
    service.show("http://mock-api.com");
    expect(service.isShown).toBe(true);
  });

  it('should not set isShown to true if route is whitlisted', () => {
    service.show("http://realm/my-realm/user/abc-123");
    expect(service.isShown).toBe(false);
  });

  it ('should set isShown to false when hide() is called', () => {
    service.isShown = true;
    expect(service.isShown).toBe(true);
    service.hide();
    expect(service.isShown).toBe(false);
  });
});
