import { TestBed, async } from '@angular/core/testing';

import { HttpRequestMonitorService } from './http-request-monitor.service';
import {HttpSignatureKey} from '../util/constants';

describe('HttpRequestMonitorService', () => {
  let service: HttpRequestMonitorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.get(HttpRequestMonitorService);
  });

  it('should be created', () => {
    const service: HttpRequestMonitorService = TestBed.get(HttpRequestMonitorService);
    expect(service).toBeTruthy();
  });

  it('should send the unsigned request with the monitor off', async(() => {
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open("GET", "https://google.com");
    let spy = spyOn(xhr, 'abort');
    xhr.send();
    expect(spy).toHaveBeenCalledTimes(0);
  }));

  it('should abort the unsigned request with monitor on', async(() => {
    service.start();
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open("GET", "https://google.com");
    let spy = spyOn(xhr, 'abort');
    xhr.send();
    expect(spy).toHaveBeenCalledTimes(1);
    service.stop();
  }));

  it('should abort the request if there is no signature match with monitor on', async(() => {
    service.start();
    service.addSignature("fake-signature");
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open("GET", "https://google.com");
    xhr.setRequestHeader(HttpSignatureKey, "another-fake-signature");
    let spy = spyOn(xhr, "abort");
    xhr.send();
    expect(spy).toHaveBeenCalledTimes(1);
    service.stop();
  }));

  it('should send the signed request with monitor on', async(() => {
    const sig: string = "fake-signature";
    service.start();
    service.addSignature(sig);
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open("GET", "https://google.com");
    xhr.setRequestHeader(HttpSignatureKey, sig);
    let spy = spyOn(xhr, "abort");
    xhr.send();
    expect(spy).toHaveBeenCalledTimes(0);
    service.stop();
  }));

});
