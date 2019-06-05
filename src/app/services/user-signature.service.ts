import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserSignature} from '../models/user-signature.model';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserSignatureService {

  constructor(private http: HttpClient, private authSvc: AuthService) { }

  findByUserId(userId: string): Observable<UserSignature> {
    return this.http.get<UserSignature>(
      `${this.baseUri()}/${userId}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  update(sigData: UserSignature): Observable<UserSignature> {
    return this.http.put<UserSignature>(
      `${this.baseUri()}/${sigData.userId}`,
      sigData,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  private baseUri(): string {
    return `${this.authSvc.globalConfig.registrationServiceConnection}api/v1/signatures`;
  }
}
