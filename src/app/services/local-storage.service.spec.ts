import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  const key: string = "testkey";
  const value: string = "testvalue";

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.get(LocalStorageService);

  });

  it('should be created', () => {
    const service: LocalStorageService = TestBed.get(LocalStorageService);
    expect(service).toBeTruthy();
  });

  it('should get, set, and remove a localstorage item', () => {
    expect(service.getItem(key)).toBeNull();
    service.setItem(key, value);
    expect(service.getItem(key)).toBe(value);
    service.removeItem(key);
    expect(service.getItem(key)).toBeNull();
  });
});
