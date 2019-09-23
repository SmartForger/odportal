import { Injectable } from '@angular/core';
import { UserRegistration } from '../models/user-registration.model';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Form, RegistrationSection, Approval, ApproverContact } from '../models/form.model';


@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {

  constructor(private authSvc: AuthService, private http: HttpClient) { }

  getUserRegistration(userId: string): Observable<UserRegistration>{
    return this.http.get<UserRegistration>(
      `${this.baseUri()}/${userId}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    )
  }

  submitSection(userId: string, regId: string, formId: string, section: RegistrationSection, approvals: Array<ApproverContact>): Observable<UserRegistration>{
    return this.http.patch<UserRegistration>(
      `${this.baseUri()}/${userId}/registration/${regId}/form/${formId}`,
      {
        section: section,
        approvals: approvals
      },
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    )
  }
  
  unsubmitSection(userId: string, regId: string, formId: string, sectionTitle: string){
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

  private baseUri(): string{
    //return `${this.authSvc.globalConfig.registrationServiceConnection}/users`;
    return `${this.authSvc.globalConfig.registrationServiceConnection}api/v1/applicants/realm/${this.authSvc.globalConfig.realm}`
  }
}
