import { TestBed } from '@angular/core/testing';
import {Router} from '@angular/router';

import { AppLaunchRequestService } from './app-launch-request.service';
import {AppLaunchRequest} from '../models/app-launch-request.model';

describe('AppLaunchRequestService', () => {
  const mockRouter = {
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: Router, useValue: mockRouter
      }
    ]
  }));

  it('should be created', () => {
    const service: AppLaunchRequestService = TestBed.get(AppLaunchRequestService);
    expect(service).toBeTruthy();
  });

  it('should set appState and trigger navigation', () => {
    const appState: string = "test";
    const launchPath: string = "/portal/app/123";
    const service: AppLaunchRequestService = TestBed.get(AppLaunchRequestService);
    const request: AppLaunchRequest = {
      data: appState,
      launchPath: launchPath
    };
    service.requestLaunch(request);
    expect(request.data).toEqual(appState);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(launchPath);
  });
});
