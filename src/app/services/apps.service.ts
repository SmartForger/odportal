import { Injectable } from '@angular/core';
import {TestableService} from '../interfaces/testable-service';
import {Observable, Subject, from} from 'rxjs';
import {ApiResponse} from '../models/api-response.model';
import {HttpClient} from '@angular/common/http';
import {AdminCredentials} from '../models/admin-credentials.model';
import {App} from '../models/app.model';
import {AuthService} from './auth.service';
import {Client} from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class AppsService implements TestableService {

  appSub: Subject<App>;

  constructor(private http: HttpClient, private authSvc: AuthService) { 
    this.appSub = new Subject<App>();
  }

  test(route: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(route + 'api/v1/test');
  }

  setup(route: string, creds: AdminCredentials, adminRoleId: string, appClients: Array<Client>): Observable<Array<App>> {
    return this.http.post<Array<App>>(
      route + 'api/v1/apps/setup',
      {creds: creds, adminRoleId: adminRoleId, appClients: appClients}
    );
  }

  listUserApps(userId: string): Observable<Array<App>> {
    return this.http.get<Array<App>>(
      this.createBaseAPIUrl() + 'realm/' + this.authSvc.globalConfig.realm + '/user/' + userId,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  listRoleApps(roleId: string): Observable<Array<App>> {
    return this.http.get<Array<App>>(
      this.createBaseAPIUrl() + 'role/' + roleId
    );
  }

  listApps(): Observable<Array<App>> {
    return this.http.get<Array<App>>(
      this.createBaseAPIUrl()
    );
  }

  update(app: App): Observable<App> {
    return this.http.put<App>(
      this.createBaseAPIUrl() + app.docId,
      app
    );
  }

  fetch(appId: string): Observable<App> {
    return this.http.get<App>(
      this.createBaseAPIUrl() + appId
    );
  }

  appUpdated(app: App): void {
    this.appSub.next(app);
  }

  private createBaseAPIUrl(): string {
    return this.authSvc.globalConfig.appsServiceConnection + 'api/v1/apps/';
  }
}
