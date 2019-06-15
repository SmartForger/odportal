import { Injectable } from '@angular/core';
import { UserProfileWithRegistration } from '../models/user-profile-with-registration.model';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { RegistrationSection, Form } from '../models/form.model';
import { UserRegistration } from '../models/user-registration.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrationManagerService {

  constructor(private authSvc: AuthService, private http: HttpClient) { }

  listUsers(): Observable<Array<UserProfileWithRegistration>>{
    return this.http.get<Array<UserProfileWithRegistration>>(
      `${this.baseUri()}/pending`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  getUserRegistration(regId: string): Observable<UserRegistration>{
    return this.http.get<UserRegistration>(
      `${this.baseUri()}/registration/${regId}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    )
  }

  submitSection(regId: string, formId: string, section: RegistrationSection): Observable<UserRegistration>{
    return this.http.patch<UserRegistration>(
      `${this.baseUri()}/registration/${regId}/form/${formId}`,
      section,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  } 

  approveUser(regId: string): Observable<UserRegistration>{
    return this.http.patch<UserRegistration>(
      `${this.baseUri()}/approve/${regId}`,
      null,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    )
  }

  private baseUri(): string{
    return `${this.authSvc.globalConfig.registrationServiceConnection}api/v1/management/realm/${this.authSvc.globalConfig.realm}`
  }
}
