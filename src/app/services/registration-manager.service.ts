import { Injectable } from '@angular/core';
import { UserProfileWithRegistration } from '../models/user-profile-with-registration.model';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { RegistrationSection, Form } from '../models/form.model';
import { UserRegistration } from '../models/user-registration.model';
import { UserRegistrationSummary } from '../models/user-registration-summary.model';
import { ApplicantColumn, PagedApplicantColumnResult, ApplicantTableSettings, ApplicantTableOptions } from '../models/applicant-table.models';
import { Registration } from '../models/registration.model';

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

    populateApplicantTable(regId: string, options?: ApplicantTableOptions): Observable<PagedApplicantColumnResult> {
        // let paramStr = '';
        // if (params) {
        //     let queryParams = new Array<string>();
        //     queryParams.push('?');
        //     if(params.hasOwnProperty('page')){queryParams.push(`page=${params.page}&`);}
        //     if(params.hasOwnProperty('perPage')){queryParams.push(`perPage=${params.perPage}&`);}
        //     if(params.hasOwnProperty('orderBy')){queryParams.push(`orderBy=${params.orderBy}&`);}
        //     if(params.hasOwnProperty('orderType')){queryParams.push(`orderType=${params.orderType}&`);}
        //     if(params.hasOwnProperty('orderDirection')){queryParams.push(`orderDirection=${params.orderDirection}&`);}
        //     if(params.hasOwnProperty('orderSubkey')){queryParams.push(`orderSubkey=${params.orderSubkey}&`);}
        //     if(params.hasOwnProperty('showClosed')){queryParams.push(`showClosed=${params.showClosed}&`);}
        //     if(params.hasOwnProperty('countTotal')){queryParams.push(`countTotal=${params.countTotal}`);}
        //     else{
        //         let lastStr = queryParams[queryParams.length - 1];
        //         queryParams[queryParams.length - 1] = lastStr.substr(0, lastStr.length - 1);
        //     }
        //     paramStr = queryParams.join('');
        // }
        // console.log(paramStr);
        return this.http.post<PagedApplicantColumnResult>(
            `${this.baseUri()}/applicant-table/populate/user-id/${this.authSvc.getUserId()}/reg-id/${regId}`,
            options || { },
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    updateColumns(columns: Array<ApplicantColumn>, regId: string): Observable<Array<ApplicantColumn>>{
        return this.http.post<Array<ApplicantColumn>>(
            `${this.baseUri()}/applicant-table/columns/user-id/${this.authSvc.getUserId()}/reg-id/${regId}`,
            columns,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    loadTableSettings(): Observable<ApplicantTableSettings>{
        return this.http.get<ApplicantTableSettings>(
            `${this.baseUri()}/applicant-table/settings/user-id/${this.authSvc.getUserId()}`,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    saveTableSettings(settings: Partial<ApplicantTableSettings>): Observable<void>{
        return this.http.post<void>(
            `${this.baseUri()}/applicant-table/settings/user-id/${this.authSvc.getUserId()}`,
            settings,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    restartRegistration(regId: string): Observable<UserRegistration>{
        return this.http.delete<UserRegistration>(
            `${this.baseUri()}/restart/${regId}`,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    deleteAccount(userId: string): Observable<void>{
        return this.http.delete<void>(
            `${this.baseUri()}/delete-user-account/${userId}`,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    updateBindings(regId: string, bindingMap: any): Observable<UserRegistration> {
        return this.http.patch<UserRegistration>(
            `${this.baseUri()}/${this.authSvc.getUserId()}/registration/${regId}/update-bindings`,
            bindingMap,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    updateProcess(regProcess: Registration): Observable<Registration>{
        return this.http.patch<Registration>(
            `${this.baseUri()}/process-id/${regProcess.docId}`,
            regProcess,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    uploadPhysicalReplacement(regId: string, formId: string, file: File): Observable<UserRegistration>{
        let formData = new FormData();
        formData.append('physicalForm', file);
        return this.http.post<UserRegistration>(
            `${this.baseUri()}/registration/${regId}/form/${formId}/upload-physical-copy`,
            formData,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }

        );
    }

    private baseUri(): string {
        return `${this.authSvc.globalConfig.registrationServiceConnection}api/v1/management/realm/${this.authSvc.globalConfig.realm}`
    }
}
