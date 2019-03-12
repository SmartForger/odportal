import { Injectable } from '@angular/core';
import {HttpClient, HttpRequest, HttpHeaders, HttpEvent, HttpEventType} from '@angular/common/http';
import {ApiRequest, ApiRequestHeader} from '../models/api-request.model';
import {HttpRequestMonitorService} from './http-request-monitor.service';
import {AuthService} from './auth.service';
import {AppsService} from './apps.service';
import {App} from '../models/app.model';
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestControllerService {

  constructor(
    private http: HttpClient, 
    private authSvc: AuthService,
    private appsSvc: AppsService,
    private httpMonitorSvc: HttpRequestMonitorService) { }

  send(request: ApiRequest, appId: string): void {
    const app: App = this.findApp(appId);
    try {
      const req: HttpRequest<any> = this.createRequest(request);
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
    catch(error) {
      if (typeof request.onError === "function") {
        request.onError("Invalid request format");
      }
    }
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
    let headers = this.authSvc.getAuthorizationHeader();
    if (requestHeaders) {
      requestHeaders = requestHeaders.filter((h: ApiRequestHeader) => {
        return h.key.toLowerCase() !== "authorization";
      });
      requestHeaders.forEach((h: ApiRequestHeader) => {
        headers = headers.set(h.key, h.value);
      });
      const signature = uuid.v4();
      headers = headers.set("od360-request-signature", signature);
      this.httpMonitorSvc.addSignature(signature);
    }
    return headers;
  }

  private findApp(appId: string): App {
    return this.appsSvc.appStore.find((app: App) => app.docId === appId);
  }

}
