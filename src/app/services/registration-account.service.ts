import { Injectable } from '@angular/core';
import { UserRepresentation } from '../models/user-representation.model';
import { CredentialsRepresentation } from '../models/credentials-representation.model';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BindingInitializations } from '../models/user-registration.model';

@Injectable({
  providedIn: 'root',
})
export class RegistrationAccountService {
  constructor(private authSvc: AuthService, private http: HttpClient) {}

  createApplicantAccount(
    procId: string,
    userRep: UserRepresentation,
    credsRep: CredentialsRepresentation,
    bindingInitializations: Array<BindingInitializations>,
    emailApplicant: boolean
  ): Observable<UserRepresentation> {
    return this.http.post<UserRepresentation>(
      `${this.baseUri()}/applicant`,
      {
        bindingInitializations: bindingInitializations,
        creds: credsRep,
        emailApplicant: emailApplicant,
        processId: procId,
        user: userRep,
      },
      {
        headers: this.authSvc.getAuthorizationHeader(),
      }
    );
  }

  checkUsername(username: string) {
    return this.http.get(
      `${this.baseUri()}/check-username?username=${username}`,
      {
        headers: this.authSvc.getAuthorizationHeader(),
      }
    );
  }

  private baseUri(): string {
    return `${this.authSvc.globalConfig.registrationServiceConnection}api/v1/account`;
  }
}
