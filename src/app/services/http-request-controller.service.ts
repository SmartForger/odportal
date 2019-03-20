import { Injectable } from '@angular/core';
import {HttpClient, HttpRequest, HttpHeaders, HttpEvent, HttpEventType} from '@angular/common/http';
import {ApiRequest} from '../models/api-request.model';
import {ApiRequestHeader} from '../models/api-request-header.model';
import {AuthService} from './auth.service';
import {Subject} from 'rxjs';
import {App} from '../models/app.model';
import {AppsService} from './apps.service';
import { ApiCallDescriptor } from '../models/api-call-descriptor.model';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestControllerService {

  requestCompletionSub: Subject<ApiRequest>;

  private readonly UNDECLARED_IN_MANIFEST: string;
  private readonly INVALID_REQUEST: string;
  private readonly UNTRUSTED_APP: string;
  private coreServiceBaseUrls: Array<string>;

  constructor(
    private http: HttpClient, 
    private authSvc: AuthService,
    private appsSvc: AppsService) { 
      this.requestCompletionSub = new Subject<ApiRequest>();
      this.UNDECLARED_IN_MANIFEST = "Request was blocked because it was not declared in the manifest";
      this.INVALID_REQUEST = "Invalid request format";
      this.UNTRUSTED_APP = "Attempted to communicate with a core service using a verb other than 'GET'. This app is not Trusted.";
      this.coreServiceBaseUrls = new Array<string>();
    }

  send(request: ApiRequest): void {
    try {
      const app: App = this.appsSvc.appStore.find((app: App) => app.docId === request.appId);
      if (this.requestIsPermitted(request, app)) {
        if (this.requestIsDeclared(request, app)) {
          const req: HttpRequest<any> = this.createRequest(request);
          this.sendRequest(req, request);
        }
        else {
          this.callback(request.onError, this.UNDECLARED_IN_MANIFEST);
          this.emitRequestCompletion(request, false, this.UNDECLARED_IN_MANIFEST);
        }
      }
      else {
        this.callback(request.onError, this.UNTRUSTED_APP);
        this.emitRequestCompletion(request, false, this.UNTRUSTED_APP);
      }
    }
    catch(error) {
      this.callback(request.onError, this.INVALID_REQUEST);
      this.emitRequestCompletion(request, false, this.INVALID_REQUEST);
    }
  }

  private requestIsPermitted(request: ApiRequest, app: App): boolean {
    let permitted: boolean = true;
    if (!app.trusted) {
      if (this.coreServiceBaseUrls.length === 0) {
        this.populateCoreServicesArray();
      }
      for (let i: number = 0; i < this.coreServiceBaseUrls.length; ++i) {
        if (request.uri.includes(this.coreServiceBaseUrls[i])) {
          if (request.verb.toLowerCase() !== "get")
          permitted = false;
          break;
        }
      }
    }
    return permitted;
  }

  private populateCoreServicesArray(): void {
    this.coreServiceBaseUrls.push(this.authSvc.globalConfig.ssoConnection);
    this.coreServiceBaseUrls.push(this.authSvc.globalConfig.dashboardServiceConnection);
    this.coreServiceBaseUrls.push(this.authSvc.globalConfig.servicesServiceConnection);
    this.coreServiceBaseUrls.push(this.authSvc.globalConfig.vendorsServiceConnection);
    this.coreServiceBaseUrls.push(this.authSvc.globalConfig.appsServiceConnection);
  }

  private requestIsDeclared(request: ApiRequest, app: App): boolean {
    let declared: boolean = false;
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
    return declared;
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
            else {
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
    this.http.request<any>(req).subscribe(
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
