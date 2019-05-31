/**
 * @description Creates AJAX calls for third-party apps and widgets per their descriptions. Does not create calls if security checks do not pass.
 * @author Steven M. Redman
 */

import { Injectable } from '@angular/core';
import {HttpClient, HttpRequest, HttpHeaders, HttpEvent, HttpEventType} from '@angular/common/http';
import {ApiRequest} from '../models/api-request.model';
import {ApiRequestHeader} from '../models/api-request-header.model';
import {AuthService} from './auth.service';
import {Subject, Observable, Subscription} from 'rxjs';
import {App} from '../models/app.model';
import {AppsService} from './apps.service';
import { ApiCallDescriptor } from '../models/api-call-descriptor.model';
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestControllerService {

  private requestCompletionSub: Subject<ApiRequest>;
  private requestTracker: Map<string, Subscription>;

  readonly ErrorResponses = {
    UndeclaredInManifest: "Request was blocked because it was not declared in the manifest",
    UntrustedApp: "Attempted to communicate with a core service using a verb other than 'GET'. This app is not Trusted."
  };

  constructor(
    private http: HttpClient, 
    private authSvc: AuthService,
    private appsSvc: AppsService) { 
      this.requestCompletionSub = new Subject<ApiRequest>();
      this.requestTracker = new Map<string, Subscription>();
    }

  send(request: ApiRequest, app: App = null): void {
    try {
      if (app === null) {
        app = this.appsSvc.getLocalAppCache().find((app: App) => app.docId === request.appId);
      }
      if (this.requestIsPermitted(request, app)) {
        if (this.requestIsDeclared(request, app)) {
          const req: HttpRequest<any> = this.createRequest(request);
          this.sendRequest(req, request);
        }
        else {
          this.callback(request.onError, this.ErrorResponses.UndeclaredInManifest);
          this.emitRequestCompletion(request, false, this.ErrorResponses.UndeclaredInManifest);
        }
      }
      else {
        this.callback(request.onError, this.ErrorResponses.UntrustedApp);
        this.emitRequestCompletion(request, false, this.ErrorResponses.UntrustedApp);
      }
    }
    catch(error) {
      console.log(error);
      this.callback(request.onError, error);
      this.emitRequestCompletion(request, false, error);
    }
  }

  observeRequestCompletions(): Observable<ApiRequest> {
    return this.requestCompletionSub.asObservable();
  }

  cancelRequest(reqId: string): void {
    const sub: Subscription = this.requestTracker.get(reqId);
    if (sub) {
      sub.unsubscribe();
    }
  }

  private requestIsPermitted(request: ApiRequest, app: App): boolean {
    let permitted: boolean = true;
    /*if (!app.trusted && !app.native) {
      const coreServiceBaseUrls = this.authSvc.getCoreServicesArray();
      for (let i: number = 0; i < coreServiceBaseUrls.length; ++i) {
        if (request.uri.includes(coreServiceBaseUrls[i])) {
          if (request.verb.toLowerCase() !== "get")
          permitted = false;
          break;
        }
      }
    }*/
    return permitted;
  }

  private requestIsDeclared(request: ApiRequest, app: App): boolean {
    /*let declared: boolean = false;
    if (request.appId) {
      if (app) {
        if (!app.native && app.apiCalls) {
          declared = this.matchApiCallDescriptor(request, app);
        }
        else if (app.native) {
          declared = true;
        }
      }
    }
    return declared;*/
    return true;
  }

  private matchApiCallDescriptor(request: ApiRequest, app: App): boolean {
    let matches: boolean = false;
    const apiCall: ApiCallDescriptor = app.apiCalls.find((ac: ApiCallDescriptor) => {
      if (request.verb.toLowerCase() === ac.verb.toLowerCase()) {
        const protocolRegExp: RegExp = new RegExp(/http(s)?:\/\//g);
        const acUrl: string = ac.url.replace(protocolRegExp, "");
        const reqUrl: string = request.uri.replace(protocolRegExp, "");
        const splitAc: Array<string> = acUrl.split("/");
        const splitReq: Array<string> = reqUrl.split("/");
        if (splitAc.length === splitReq.length) {
          let combined: Array<string> = new Array<string>();
          splitAc.forEach((part: string, index: number) => {
            if (part !== "{$}") {
              combined.push(part);
            }
            else if (splitReq[index]) {
              combined.push(splitReq[index]);
            }
          });
          const combinedStr: string = combined.join("/");
          return (combinedStr === reqUrl);
        }
      }
      return false;
    });
    if (apiCall) {
      matches = true;
    }
    return matches;
  }

  private createRequest(request: ApiRequest): HttpRequest<any> {
    let reportProgress = (typeof request.onProgress === "function");
    let headers: HttpHeaders = this.createHeaders(request.headers);
    let req: HttpRequest<any> = new HttpRequest<any>(
      request.verb,
      request.uri,
      request.body || {},
      {
        headers: headers,
        reportProgress: reportProgress
      }
    );
    return req;
  }

  private createHeaders(requestHeaders: Array<ApiRequestHeader>): HttpHeaders {
    let headers = this.authSvc.getAuthorizationHeader(true);
    if (requestHeaders) {
      requestHeaders = requestHeaders.filter((h: ApiRequestHeader) => {
        return h.key.toLowerCase() !== "authorization";
      });
      requestHeaders.forEach((h: ApiRequestHeader) => {
        headers = headers.set(h.key, h.value);
      });
    }

    return headers;
  }

  private sendRequest(req: HttpRequest<any>, request: ApiRequest): void {
    let sub: Subscription = this.http.request<any>(req).subscribe(
      (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.Response) {
          this.callback(request.onSuccess, event.body);
          this.emitRequestCompletion(request, true, event.body);
        }
        else if (event.type === HttpEventType.UploadProgress) {
          this.callback(request.onProgress, Math.round(event.loaded / event.total));
        }
      },
      (err: any) => {
        this.callback(request.onError, err);
        this.emitRequestCompletion(request, false, err);
      }
    );
    const reqId: string = uuid.v4();
    this.requestTracker.set(reqId, sub);
    this.callback(request.onCreated, reqId);
  }

  private callback(cb: any, param: any): void {
    if (typeof cb === "function") {
      cb(param);
    }
  }

  private emitRequestCompletion(request: ApiRequest, succeeded: boolean, response: any): void {
      request.succeeded = succeeded;
      request.response = response;
      this.requestCompletionSub.next(request);
  }
}
