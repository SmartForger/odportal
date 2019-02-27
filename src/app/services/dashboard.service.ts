import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDashboard } from '../models/user-dashboard.model';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient, private authSvc: AuthService) { }

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

  private getUrl(): string{
    return this.authSvc.globalConfig.dashboardServiceConnection + '/' + this.authSvc.getUserId + '/dashboard';
  }
}
