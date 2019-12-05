import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UserDashboard, DashboardTemplateGridChanges } from '../models/user-dashboard.model';

@Injectable({
    providedIn: 'root'
})
export class DashboardTemplateService {

    constructor(private http: HttpClient, private authSvc: AuthService) { }

    createTemplate(template: UserDashboard): Observable<UserDashboard>{
        return this.http.post<UserDashboard>(
            this.getUrl(),
            template,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    deleteTemplate(templateId: string): Observable<void>{
        return this.http.delete<void>(
            `${this.getUrl()}${templateId}`,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    listInstancesByRole(role: string): Observable<Array<UserDashboard>>{
        return this.http.get<Array<UserDashboard>>(
            `${this.getUrl()}role/${role}`,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    listTemplatesByRole(role: string): Observable<Array<UserDashboard>>{
        return this.http.get<Array<UserDashboard>>(
            `${this.getUrl()}role/${role}`,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }


    listUserInstancesByEvent(eventId: string): Observable<Array<UserDashboard>>{
        return this.http.get<Array<UserDashboard>>(
            `${this.getUrl()}instances/user/${this.authSvc.userState.userId}/event/${eventId}`,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    renameTemplate(templateId: string, name: string): Observable<UserDashboard>{
        return this.http.put<UserDashboard>(
            `${this.getUrl()}${templateId}/rename`,
            {title: name},
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    updateTemplate(templateId: string, gridChanges: DashboardTemplateGridChanges): Observable<UserDashboard>{
        return this.http.put<UserDashboard>(
            `${this.getUrl()}${templateId}`,
            gridChanges,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    updateInstance(instance: UserDashboard): Observable<UserDashboard>{
        return this.http.post<UserDashboard>(
            `${this.getUrl()}instances`,
            instance,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    private getUrl(): string{
        return `${this.authSvc.globalConfig.userProfileServiceConnection}api/v1/dashboard-templates/realm/${this.authSvc.globalConfig.realm}/`;
    }
}
