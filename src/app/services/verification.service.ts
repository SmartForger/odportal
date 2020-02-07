import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Form, RegistrationSection } from '../models/form.model';
import { Observable } from 'rxjs';
import { UserProfileWithRegistration } from '../models/user-profile-with-registration.model';
import { PagedApplicantColumnResult, ApplicantColumn, ApplicantTableSettings, ApplicantTableOptions } from '../models/applicant-table.models';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  constructor(private authSvc: AuthService, private http: HttpClient) { }

  getUsersToApprove(): Observable<Array<UserProfileWithRegistration>>{
    return this.http.get<Array<UserProfileWithRegistration>>(
      `${this.baseUri()}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  getForms(regId: string): Observable<Array<Form>>{
    return this.http.get<Array<Form>>(
      `${this.baseUri()}/registration/${regId}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  submitSection(regId: string, formId: string, section: RegistrationSection): Observable<Form>{
    return this.http.patch<Form>(
      `${this.baseUri()}/registration/${regId}/form/${formId}`,
      section,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

    populateApplicantTable(regId: string, options?: ApplicantTableOptions): Observable<PagedApplicantColumnResult> {
        // let paramStr = '';
        // if (params) {
        //     let queryParams = new Array<string>();
        //     queryParams.push('?');
        //     if (params.hasOwnProperty('page')) { queryParams.push(`page=${params.page}&`); }
        //     if (params.hasOwnProperty('perPage')) { queryParams.push(`perPage=${params.perPage}&`); }
        //     if (params.hasOwnProperty('orderBy')) { queryParams.push(`orderBy=${params.orderBy}&`); }
        //     if (params.hasOwnProperty('orderType')) { queryParams.push(`orderType=${params.orderType}&`); }
        //     if (params.hasOwnProperty('orderDirection')) { queryParams.push(`orderDirection=${params.orderDirection}&`); }
        //     if (params.hasOwnProperty('orderSubkey')) { queryParams.push(`orderSubkey=${params.orderSubkey}&`); }
        //     if (params.hasOwnProperty('showClosed')) { queryParams.push(`showClosed=${params.showClosed}&`); }
        //     if (params.hasOwnProperty('verifierEmail')) { queryParams.push(`verifierEmail=${params.verifierEmail}&`); }
        //     if (params.hasOwnProperty('countTotal')) { queryParams.push(`countTotal=${params.countTotal}`); }
        //     else {
        //         let lastStr = queryParams[queryParams.length - 1];
        //         queryParams[queryParams.length - 1] = lastStr.substr(0, lastStr.length - 1);
        //     }
        //     paramStr = queryParams.join('');
        // }
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

    getUserProfile(regId: string): Observable<UserProfile>{
        return this.http.get<UserProfile>(
            `${this.baseUri()}/user-profile/${regId}`,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        )
    }

    private baseUri(): string {
        return `${this.authSvc.globalConfig.registrationServiceConnection}api/v1/verifications/realm/${this.authSvc.globalConfig.realm}`
    }
}
