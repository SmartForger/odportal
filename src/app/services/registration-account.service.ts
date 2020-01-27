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

  createApplicantAccount(procId: string, userRep: UserRepresentation, credsRep: CredentialsRepresentation, readonlyBindings: Array<string> = [ ]): Observable<UserRepresentation> {
    return this.http.post<UserRepresentation>(
      `${this.baseUri()}/applicant`,
      {
        creds: credsRep,
        readonlyBindings: readonlyBindings,
        processId: procId,
        user: userRep
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
