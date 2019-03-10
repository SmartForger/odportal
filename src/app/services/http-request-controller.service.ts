import { Injectable } from '@angular/core';
import {HttpClient, HttpRequest, HttpHeaders, HttpEvent, HttpEventType} from '@angular/common/http';
import {ApiRequest, ApiRequestHeader} from '../models/api-request.model';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestControllerService {

  constructor(
    private http: HttpClient, 
    private authSvc: AuthService) { }

  send(request: ApiRequest): void {
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
    }
    return headers;
  }

}
