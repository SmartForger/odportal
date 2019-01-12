import { TestBed, async, inject } from '@angular/core/testing';

import { NativeAppGuard } from './native-app.guard';

describe('NativeAppGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NativeAppGuard]
    });
  });

  it('should ...', inject([NativeAppGuard], (guard: NativeAppGuard) => {
    expect(guard).toBeTruthy();
  }));
});
