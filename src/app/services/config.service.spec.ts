import { TestBed, async } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import { ConfigService } from './config.service';
import {GlobalConfig} from '../models/global-config.model';
import {environment as env} from '../../environments/environment';

describe('ConfigService', () => {
  let backend: HttpTestingController;
  let service: ConfigService;

  const fakeConfig: GlobalConfig = {
    docId: "mock-config",
    ssoConnection: "https://mock-sso/"
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    backend = TestBed.get(HttpTestingController);
    service = TestBed.get(ConfigService);
  });

  it('should be created', () => {
    const service: ConfigService = TestBed.get(ConfigService);
    expect(service).toBeTruthy();
  });

  it('should fetch the global config', async(() => {
    service.fetchConfig().subscribe(
      (gc: GlobalConfig) => {
        expect(gc).toEqual(fakeConfig);
      }
    );
    const mockReq = backend.expectOne(env.configSvcApi);
    expect(mockReq.request.method).toBe('GET');
    mockReq.flush(fakeConfig);
    backend.verify();
  }));
});
