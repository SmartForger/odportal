/**
 * @description Service that handles app/widget-related requests, including comments. Also notifies subscribers of changes to the local app cache and when an app is updated.
 * @author Steven M. Redman
 */

import { Injectable } from '@angular/core';
import {Observable, Subject, BehaviorSubject} from 'rxjs';
import {HttpClient, HttpRequest, HttpEvent} from '@angular/common/http';
import {App} from '../models/app.model';
import {AuthService} from './auth.service';
import {AppComment} from '../models/app-comment.model';
import {ApiSearchCriteria} from '../models/api-search-criteria.model';
import {ApiSearchResult} from '../models/api-search-result.model';

@Injectable({
  providedIn: 'root'
})
export class AppsService {

  private appUpdatedSub: Subject<App>;
  private appCacheSub: BehaviorSubject<Array<App>>;

  constructor(
    private http: HttpClient, 
    private authSvc: AuthService) { 
    this.appUpdatedSub = new Subject<App>();
    this.appCacheSub = new BehaviorSubject<Array<App>>([]);
  }

  listUserApps(userId: string): Observable<Array<App>> {
    return this.http.get<Array<App>>(
      `${this.createBaseAPIUrl()}realm/${this.authSvc.globalConfig.realm}/user/${userId}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  listRoleApps(roleId: string): Observable<Array<App>> {
    return this.http.get<Array<App>>(
      `${this.createBaseAPIUrl()}realm/${this.authSvc.globalConfig.realm}/role/${roleId}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  listVendorApps(vendorId: string, approved: boolean, search: ApiSearchCriteria): Observable<ApiSearchResult<App>> {
    return this.http.get<ApiSearchResult<App>>(
      `${this.createBaseAPIUrl()}realm/${this.authSvc.globalConfig.realm}/vendor/${vendorId}/` + (approved ? "approved" : "pending"),
      {
        headers: this.authSvc.getAuthorizationHeader(),
        params: search.asHttpParams()
      }
    );
  }

  fetchVendorApp(vendorId: string, appId: string): Observable<App> {
    return this.http.get<App>(
      `${this.createBaseAPIUrl()}realm/${this.authSvc.globalConfig.realm}/vendor/${vendorId}/app/${appId}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  fetchVendorAppComments(vendorId: string, appId: string): Observable<Array<AppComment>> {
    return this.http.get<Array<AppComment>>(
      `${this.createBaseAPIUrl()}realm/${this.authSvc.globalConfig.realm}/vendor/${vendorId}/app/${appId}/comments`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  listThirdPartyApps(approved: boolean, search: ApiSearchCriteria): Observable<ApiSearchResult<App>> {
    return this.http.get<ApiSearchResult<App>>(
      `${this.createBaseAPIUrl()}realm/${this.authSvc.globalConfig.realm}/` + (approved ? "approved" : "pending"),
      {
        headers: this.authSvc.getAuthorizationHeader(),
        params: search.asHttpParams()
      }
    );
  }

  listNativeApps(search: ApiSearchCriteria): Observable<ApiSearchResult<App>> {
    return this.http.get<ApiSearchResult<App>>(
      `${this.createBaseAPIUrl()}realm/${this.authSvc.globalConfig.realm}/native`,
      {
        headers: this.authSvc.getAuthorizationHeader(),
        params: search.asHttpParams()
      }
    );
  }

  create(file: File): Observable<HttpEvent<App>> {
    let formData: FormData = new FormData();
    formData.append('app', file);
    let req: HttpRequest<FormData> = new HttpRequest<FormData>(
      "POST", 
      `${this.createBaseAPIUrl()}realm/${this.authSvc.globalConfig.realm}`,
      formData,
      {
        headers: this.authSvc.getAuthorizationHeader(true),
        reportProgress: true,
      }
    );
    return this.http.request<App>(req);
  }

  postComment(vendorId: string, appId: string, comment: AppComment): Observable<AppComment> {
    return this.http.post<AppComment>(
      `${this.createBaseAPIUrl()}realm/${this.authSvc.globalConfig.realm}/vendor/${vendorId}/app/${appId}/comments`,
      comment,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  update(app: App): Observable<App> {
    return this.http.put<App>(
      `${this.createBaseAPIUrl()}realm/${this.authSvc.globalConfig.realm}/app/${app.docId}`,
      app,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  fetch(appId: string): Observable<App> {
    return this.http.get<App>(
      `${this.createBaseAPIUrl()}realm/${this.authSvc.globalConfig.realm}/app/${appId}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  delete(appId: string): Observable<App> {
    return this.http.delete<App>(
      `${this.createBaseAPIUrl()}realm/${this.authSvc.globalConfig.realm}/app/${appId}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  setLocalAppCache(apps: Array<App>): void {
    this.appCacheSub.next(apps);
  }

  getLocalAppCache(): Array<App> {
    return this.appCacheSub.getValue();
  }

  observeLocalAppCache(): Observable<Array<App>> {
    return this.appCacheSub.asObservable();
  }

  appUpdated(app: App): void {
    this.appUpdatedSub.next(app);
  }

  observeAppUpdates(): Observable<App> {
    return this.appUpdatedSub.asObservable();
  }

  private createBaseAPIUrl(): string {
    return `${this.authSvc.globalConfig.appsServiceConnection}api/v1/apps/`;
  }
}
