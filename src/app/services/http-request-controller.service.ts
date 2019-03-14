import { Injectable } from '@angular/core';
import {HttpClient, HttpRequest, HttpHeaders, HttpEvent, HttpEventType} from '@angular/common/http';
import {ApiRequest} from '../models/api-request.model';
import {ApiRequestHeader} from '../models/api-request-header.model';
import {HttpRequestMonitorService} from './http-request-monitor.service';
import {AuthService} from './auth.service';
import * as uuid from 'uuid';
import {HttpSignatureKey} from '../util/constants';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestControllerService {

  constructor(
    private http: HttpClient, 
    private authSvc: AuthService,
    private httpMonitorSvc: HttpRequestMonitorService) { }

  send(request: ApiRequest): void {
    try {
      const req: HttpRequest<any> = this.createRequest(request);
      this.sendRequest(req, request);
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
      const signature: string = uuid.v4();
      headers = headers.set(HttpSignatureKey, signature);
      this.httpMonitorSvc.addSignature(signature);
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