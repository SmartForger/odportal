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

  getUserDashboard(): Observable<UserDashboard>{
    return this.http.get<UserDashboard>(
      this.getUrl(),
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  updateUserDashboard(dashboard: UserDashboard): Observable<UserDashboard>{
    return this.http.put<UserDashboard>(
      this.getUrl(),
      dashboard,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  addWidget(app: App, widget: Widget): void{
    this.addWidgetSubject.next({
      app: app,
      widget: widget
    });
  }

  private getUrl(): string{
    return this.authSvc.globalConfig.dashboardServiceConnection + '/' + this.authSvc.getUserId + '/dashboard';
  }
}
