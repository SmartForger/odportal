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

  requestSuccessSub: Subject<ApiRequest>;

  constructor(
    private http: HttpClient, 
    private authSvc: AuthService,
    private appsSvc: AppsService) { }

  send(request: ApiRequest): void {
    try {
      if (this.requestIsDeclared(request)) {
        const req: HttpRequest<any> = this.createRequest(request);
        this.sendRequest(req, request);
      }
      else {
        if (typeof request.onError === "function") {
          request.onError("Request was blocked because it was not declared in the manifest");
        }
      }
    }
    catch(error) {
      if (typeof request.onError === "function") {
        request.onError("Invalid request format");
      }
    }
  }

  private requestIsDeclared(request: ApiRequest): boolean {
    let declared: boolean = false;
    if (request.appId) {
      const app: App = this.appsSvc.appStore.find((app: App) => app.docId === request.appId);
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
        let protocolRegExp: RegExp = new RegExp(/http(s)?:\/\//g);
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
          if (typeof request.onSuccess === "function") {
            request.onSuccess(event.body);
          }
        }
        else if (event.type === HttpEventType.UploadProgress) {
          if (typeof request.onProgress === "function") {
            request.onProgress(Math.round(event.loaded / event.total));
          }
        }
      },
      (err: any) => {
        if (typeof request.onError === "function") {
          request.onError(err);
        }
      }
    );
  }
}
