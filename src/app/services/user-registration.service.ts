import { Injectable } from '@angular/core';
import { UserRegistration } from '../models/user-registration.model';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistrationSection, ApproverContact } from '../models/form.model';


@Injectable({
    providedIn: 'root'
})
export class UserRegistrationService {

    constructor(private authSvc: AuthService, private http: HttpClient) { }

    digitalReset(userId: string, regId: string, formId: string): Observable<UserRegistration> {
        return this.http.post<UserRegistration>(
            `${this.baseUri()}/${userId}/registration/${regId}/form/${formId}/digital-reset`,
            null,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    getCurrentUserRegistration(): Observable<UserRegistration> {
        return this.http.get<UserRegistration>(
            `${this.baseUri()}/email`,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    getUserRegistration(userId: string): Observable<UserRegistration> {
        return this.http.get<UserRegistration>(
            `${this.baseUri()}/${userId}`,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        )
    }

    
    nudgeApprover(userId: string, regId: string, formId: string, sections: Array<RegistrationSection>): Observable<UserRegistration> {
        return this.http.post<UserRegistration>(
            `${this.baseUri()}/${userId}/registration/${regId}/form/${formId}/nudge`,
            sections,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    submitApproverContacts(userId: string, regId: string, formId: string, approvals: Array<ApproverContact>): Observable<UserRegistration> {
        return this.http.patch<UserRegistration>(
            `${this.baseUri()}/${userId}/registration/${regId}/form/${formId}/approvers`,
            approvals,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    submitSection(userId: string, regId: string, formId: string, section: RegistrationSection): Observable<UserRegistration> {
        return this.http.patch<UserRegistration>(
            `${this.baseUri()}/${userId}/registration/${regId}/form/${formId}`,
            section,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        )
    }

    unsubmitApproverContacts(userId: string, regId: string, formId: string): Observable<UserRegistration> {
        return this.http.patch<UserRegistration>(
            `${this.baseUri()}/${userId}/registration/${regId}/form/${formId}/approvers/unsubmit`,
            null,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    unsubmitSection(userId: string, regId: string, formId: string, sectionTitle: string): Observable<UserRegistration> {
        return this.http.patch<UserRegistration>(
            `${this.baseUri()}/${userId}/registration/${regId}/form/${formId}/unsubmit`,
            {
                sectionTitle: sectionTitle
            },
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        )
    }

    uploadPhysicalReplacement(userId: string, regId: string, formId: string, file: File): Observable<UserRegistration> {
        let formData = new FormData();
        formData.append('physicalForm', file);
        return this.http.post<UserRegistration>(
            `${this.baseUri()}/${userId}/registration/${regId}/form/${formId}/upload-physical-replacement`,
            formData,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        )
    }

    private baseUri(): string {
        //return `${this.authSvc.globalConfig.registrationServiceConnection}/users`;
        return `${this.authSvc.globalConfig.registrationServiceConnection}api/v1/applicants/realm/${this.authSvc.globalConfig.realm}`
    }
}
