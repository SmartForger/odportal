/**
 * @description Service to facilitate the dashboard feature. Talks to the server for managing user dashboards. Allows external components to add widgets to the dashboard.
 * @author James Marcu
 */

import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UserDashboard } from '../models/user-dashboard.model';
import { AuthService } from '../services/auth.service';
import { AppWithWidget } from '../models/app-with-widget.model';
import {DashboardAppReplacementInfo} from '../models/dashboard-app-replacement-info.model';
import {ApiResponse} from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService implements OnInit {

  private addWidgetSubject: Subject<AppWithWidget>;

  activeDashboardId: string;

  constructor(private http: HttpClient, private authSvc: AuthService) {
    this.addWidgetSubject = new Subject<AppWithWidget>();
    this.activeDashboardId = '';
  }

  ngOnInit(){
    this.setInitialActiveDashboardId();
  }

  listDashboards(): Observable<Array<UserDashboard>>{
    return this.http.get<Array<UserDashboard>>(
      this.getUrl(),
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  addDashboard(userDashboard: UserDashboard): Observable<UserDashboard>{
    return this.http.post<UserDashboard>(
      this.getUrl(),
      userDashboard,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  getDashboard(dashId: string): Observable<UserDashboard>{
    return this.http.get<UserDashboard>(
      `${this.getUrl()}/${dashId}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  updateDashboard(userDashboard: UserDashboard): Observable<UserDashboard>{
    return this.http.put<UserDashboard>(
      `${this.getUrl()}/${userDashboard.docId}`,
      userDashboard,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  updateDashboardAppRefs(appReplacement: Array<DashboardAppReplacementInfo>, widgetReplacements: Array<DashboardAppReplacementInfo>): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.authSvc.globalConfig.userProfileServiceConnection}api/v1/dashboard/realm/${this.authSvc.globalConfig.realm}/appRefs`,
      {
        appReplacementInfo: appReplacement,
        widgetReplacementInfo: widgetReplacements
      },
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  deleteDashboard(dashId: string): Observable<UserDashboard>{
    return this.http.delete<UserDashboard>(
      `${this.getUrl()}/${dashId}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    )
  }

  setDefaultDashboard(dashId: string): Observable<UserDashboard>{
    return this.http.patch<UserDashboard>(
      `${this.getUrl()}/${dashId}/default`,
      null,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    )
  }

  addWidget(modelPair: AppWithWidget): void{
    this.addWidgetSubject.next({
      app: modelPair.app,
      widget: modelPair.widget
    });
  }

  observeAddWidget(): Observable<AppWithWidget> {
    return this.addWidgetSubject.asObservable();
  }

  private setInitialActiveDashboardId(): void{
    this.listDashboards().subscribe( (dashboards) => {
      let lookingForDefault: boolean = true;
      let noDefault: boolean = false;
      let index: number = 0;
      while(lookingForDefault && !noDefault){
        if(index >= dashboards.length){
          noDefault = true;
          this.activeDashboardId = dashboards[0].docId;
          this.setDefaultDashboard(dashboards[0].docId).subscribe();
        }
        else if(dashboards[index].default){
          lookingForDefault = false;
          this.activeDashboardId = dashboards[index].docId;
        }
        else{
          index++;
        }
      }
    } );
  }

  private getUrl(): string{
    return `${this.authSvc.globalConfig.userProfileServiceConnection}api/v1/dashboard/realm/${this.authSvc.globalConfig.realm}/user/` + this.authSvc.getUserId();
  }
}
