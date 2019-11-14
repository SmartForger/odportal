import { Injectable } from '@angular/core';
import { UserProfileWithRegistration } from '../models/user-profile-with-registration.model';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { RegistrationSection, Form } from '../models/form.model';
import { UserRegistration } from '../models/user-registration.model';
import { UserRegistrationSummary } from '../models/user-registration-summary.model';
import { ApplicantColumn } from '../models/applicant-columns.model';

@Injectable({
    providedIn: 'root'
})
export class RegistrationManagerService {

    constructor(private authSvc: AuthService, private http: HttpClient) { }

    listPendingUsers(): Observable<Array<UserProfileWithRegistration>> {
        return this.http.get<Array<UserProfileWithRegistration>>(
            `${this.baseUri()}/pending`,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    listApprovedUsers(): Observable<Array<UserProfileWithRegistration>> {
        return this.http.get<Array<UserProfileWithRegistration>>(
            `${this.baseUri()}/approved`,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        )
    }

    listPendingSummaries(): Observable<Array<UserRegistrationSummary>> {
        return this.http.get<Array<UserRegistrationSummary>>(
            `${this.baseUri()}/summary/pending`,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        )
    }

    listApprovedSummaries(): Observable<Array<UserRegistrationSummary>> {
        return this.http.get<Array<UserRegistrationSummary>>(
            `${this.baseUri()}/summary/approved`,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        )
    }

    getUserRegistration(regId: string): Observable<UserRegistration> {
        return this.http.get<UserRegistration>(
            `${this.baseUri()}/registration/${regId}`,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        )
    }

    submitSection(regId: string, formId: string, section: RegistrationSection): Observable<UserRegistration> {
        return this.http.patch<UserRegistration>(
            `${this.baseUri()}/registration/${regId}/form/${formId}`,
            section,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    approveUser(regId: string): Observable<UserRegistration> {
        return this.http.patch<UserRegistration>(
            `${this.baseUri()}/approve/${regId}`,
            null,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        )
    }

    unapproveUser(regId: string): Observable<UserRegistration> {
        return this.http.patch<UserRegistration>(
            `${this.baseUri()}/unapprove/${regId}`,
            null,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        )
    }

    populateApplicantTable(regId, params?: any): Observable<Object> {
        let paramStr = '';
        if (params) {
            let queryParams = new Array<string>();
            queryParams.push('?');
            if(params.page){queryParams.push(`page=${params.page}&`);}
            if(params.perPage){queryParams.push(`perPage=${params.perPage}&`);}
            if(params.orderBy){queryParams.push(`orderBy=${params.orderBy}&`);}
            if(params.orderByType){queryParams.push(`orderType=${params.orderType}&`);}
            if(params.orderDirection){queryParams.push(`orderDirection=${params.orderDirection}`);}
            else{
                let lastStr = queryParams[queryParams.length - 1];
                queryParams[queryParams.length - 1] = lastStr.substr(0, lastStr.length - 1);
            }
            paramStr = queryParams.join('');
        }
        return this.http.get<Object>(
            `${this.baseUri()}/applicant-table/populate/user-id/${this.authSvc.getUserId()}/reg-id/${regId}${paramStr}`,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    private baseUri(): string {
        return `${this.authSvc.globalConfig.registrationServiceConnection}api/v1/management/realm/${this.authSvc.globalConfig.realm}`
    }
}
