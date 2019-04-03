import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HttpRequestControllerService } from './http-request-controller.service';
import { ApiRequest } from '../models/api-request.model';
import { App } from '../models/app.model';
import {AuthService} from './auth.service';
import {Subscription} from 'rxjs';

describe('HttpRequestControllerService', () => {
  let backend: HttpTestingController;
  let service: HttpRequestControllerService;
  let authSvc: AuthService;

  let fakeRequest: ApiRequest = {
    uri: "http://fake-api.com/",
    verb: 'GET',
    onSuccess: (response) => {
      expect(response).toBeFalsy();
    },
    onError: (err) => { }
  };

  let fakeApp: App = {
    docId: "fake-app-id",
    appTitle: "fake app",
    enabled: true,
    native: false,
    clientId: "fake-client-id",
    clientName: "fake client",
    trusted: false,
    apiCalls: [
      {
        url: "http://fake-api.com/",
        verb: 'GET'
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AuthService
      ]
    });

    backend = TestBed.get(HttpTestingController);
    service = TestBed.get(HttpRequestControllerService);
    authSvc = TestBed.get(AuthService);

    fakeRequest = {
      uri: "http://fake-api.com/",
      verb: 'GET',
      appId: "fake-app-id",
      onSuccess: (response) => { },
      onError: (err) => { }
    };

    fakeApp = {
      docId: "fake-app-id",
      appTitle: "fake app",
      enabled: true,
      native: false,
      clientId: "fake-client-id",
      clientName: "fake client",
      trusted: false,
      apiCalls: [
        {
          url: "http://fake-api.com/",
          verb: 'GET'
        }
      ]
    };
  });

  it('should be created', () => {
    const service: HttpRequestControllerService = TestBed.get(HttpRequestControllerService);
    expect(service).toBeTruthy();
  });

  it('should send the GET request: Parameterized: false, Trusted: false, Core Service: false, Declared: true', async(() => {
    service.send(fakeRequest, fakeApp);
    const mockReq = backend.expectOne("http://fake-api.com/");
    expect(mockReq.request.method).toBe('GET');
    backend.verify();
  }));

  it('should send the GET request: Parameterized: true, Trusted: false, Core Service: true, Declared: true', async(() => {
    fakeApp.apiCalls[0].url = `${authSvc.globalConfig.ssoConnection}{$}`;
    fakeRequest.uri = `${authSvc.globalConfig.ssoConnection}testparam`;
    service.send(fakeRequest, fakeApp);
    const mockReq = backend.expectOne(`${authSvc.globalConfig.ssoConnection}testparam`);
    expect(mockReq.request.method).toBe('GET');
    backend.verify();
  }));

  it('should send the POST request: Parameterized: false, Trusted: true, Core Service: true, Declared: true', async(() => {
    fakeApp.apiCalls[0].url = authSvc.globalConfig.ssoConnection;
    fakeApp.apiCalls[0].verb = 'post';
    fakeRequest.uri = authSvc.globalConfig.ssoConnection;
    fakeApp.trusted = true;
    fakeRequest.verb = 'POST';
    service.send(fakeRequest, fakeApp);
    const mockReq = backend.expectOne(authSvc.globalConfig.ssoConnection);
    expect(mockReq.request.method).toBe('POST');
    backend.verify();
  }));

  it('should send the POST request (Native bypass): Parameterized: false, Trusted: false, Core Service: true, Declared: false', async(() => {
    fakeApp.apiCalls.pop();
    fakeRequest.uri = authSvc.globalConfig.ssoConnection;
    fakeApp.native = true;
    fakeRequest.verb = 'POST';
    service.send(fakeRequest, fakeApp);
    const mockReq = backend.expectOne(authSvc.globalConfig.ssoConnection);
    expect(mockReq.request.method).toBe('POST');
    backend.verify();
  }));

  it('should reject the GET request (Undeclared call): Parameterized: false, Trusted: false, Core Service: false, Declared: false', async(() => {
    let sub: Subscription = service.observeRequestCompletions().subscribe(
      (req: ApiRequest) => {
        expect(req.uri).toBe(fakeRequest.uri);
        expect(req.verb).toBe(fakeRequest.verb);
        expect(req.succeeded).toBe(false);
        expect(req.response).toBe(service.ErrorResponses.UndeclaredInManifest);
        sub.unsubscribe();
      }
    );
    fakeApp.apiCalls.pop();
    service.send(fakeRequest, fakeApp);
    backend.expectNone("http://fake-api.com/");
    backend.verify();
  }));

  it('should reject the GET request (Invalid parameter): Parameterized: true, Trusted: false, Core Service: true, Declared: true', async(() => {
    let sub: Subscription = service.observeRequestCompletions().subscribe(
      (req: ApiRequest) => {
        expect(req.uri).toBe(fakeRequest.uri);
        expect(req.verb).toBe(fakeRequest.verb);
        expect(req.succeeded).toBe(false);
        expect(req.response).toBe(service.ErrorResponses.UndeclaredInManifest);
        sub.unsubscribe();
      }
    );
    fakeApp.apiCalls[0].url = `${authSvc.globalConfig.ssoConnection}`;
    fakeRequest.uri = `${authSvc.globalConfig.ssoConnection}test`;
    service.send(fakeRequest, fakeApp);
    backend.expectNone(authSvc.globalConfig.ssoConnection);
    backend.verify();
  }));

  it('should reject the POST request (Untrusted call to core service): Parameterized:false, Trusted: false, Core Service: true, Declared: true', async(() => {
    let sub: Subscription = service.observeRequestCompletions().subscribe(
      (req: ApiRequest) => {
        expect(req.uri).toBe(fakeRequest.uri);
        expect(req.verb).toBe(fakeRequest.verb);
        expect(req.succeeded).toBe(false);
        expect(req.response).toBe(service.ErrorResponses.UntrustedApp);
        sub.unsubscribe();
      }
    );
    fakeApp.apiCalls[0].url = `${authSvc.globalConfig.ssoConnection}`;
    fakeApp.apiCalls[0].verb = 'POST';
    fakeRequest.uri = `${authSvc.globalConfig.ssoConnection}`;
    fakeRequest.verb = 'POST';
    service.send(fakeRequest, fakeApp);
    backend.expectNone(authSvc.globalConfig.ssoConnection);
    backend.verify();
  }));

});
