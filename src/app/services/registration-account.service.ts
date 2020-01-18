import { Injectable } from '@angular/core';
import {UserRepresentation} from '../models/user-representation.model';
import {CredentialsRepresentation} from '../models/credentials-representation.model';
import {AuthService} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationAccountService {

  constructor(private authSvc: AuthService, private http: HttpClient) { }

  createApplicantAccount(userRep: UserRepresentation, credsRep: CredentialsRepresentation, readonlyBindings: Array<string> = [ ]): Observable<UserRepresentation> {
    return this.http.post<UserRepresentation>(
      `${this.baseUri()}/applicant`,
      {
        user: userRep,
        creds: credsRep,
        readonlyBindings: readonlyBindings
      },
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  private baseUri(): string {
    return `${this.authSvc.globalConfig.registrationServiceConnection}api/v1/account`
  }


}
