import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Form, RegistrationSection } from '../models/form.model';
import { Observable } from 'rxjs';
import { UserProfileWithRegistration } from '../models/user-profile-with-registration.model';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  constructor(private authSvc: AuthService, private http: HttpClient) { }

  getUsersToApprove(): Observable<Array<UserProfileWithRegistration>>{
    return this.http.get<Array<UserProfileWithRegistration>>(
      `${this.baseUri()}/realm/${this.authSvc.globalConfig.realm}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  getForms(regId: string): Observable<Array<Form>>{
    return this.http.get<Array<Form>>(
      `${this.baseUri()}/realm/${this.authSvc.globalConfig.realm}/registration/${regId}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  submitSection(regId: string, formId: string, section: RegistrationSection): Observable<Form>{
    return this.http.patch<Form>(
      `${this.baseUri()}/realm/${this.authSvc.globalConfig.realm}/registration/${regId}/form/${formId}`,
      section,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  private baseUri(): string {
    return `http://docker.emf360.com:49145/api/v1/verifications`
  }
}
