import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UserDashboard } from '../models/user-dashboard.model';
import { AuthService } from '../services/auth.service';
import { App } from '../models/app.model';
import { Widget } from '../models/widget.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  addWidgetSubject: Subject<{app: App, widget: Widget}>;

  constructor(private http: HttpClient, private authSvc: AuthService) {
    this.addWidgetSubject = new Subject();
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
      this.getUrl() + '/' + dashId,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  updateDashboard(userDashboard: UserDashboard): Observable<UserDashboard>{
    return this.http.put<UserDashboard>(
      this.getUrl() + '/' + userDashboard.docId,
      userDashboard,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  deleteDashboard(dashId: string): Observable<UserDashboard>{
    return this.http.delete<UserDashboard>(
      this.getUrl() + '/' + dashId,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    )
  }

  setDefaultDashboard(dashId: string): Observable<UserDashboard>{
    return this.http.patch<UserDashboard>(
      this.getUrl() + "/" + dashId + "/default",
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    )
  }

  addWidget(app: App, widget: Widget): void{
    this.addWidgetSubject.next({
      app: app,
      widget: widget
    });
  }

  private getUrl(): string{
    return "http://docker.emf360.com:49131/api/v1/dashboard/realm/" + this.authSvc.globalConfig.realm + "/user/" + this.authSvc.getUserId();
  }
}
