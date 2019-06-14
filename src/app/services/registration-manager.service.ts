import { Injectable } from '@angular/core';
import { UserProfileWithRegistration } from '../models/user-profile-with-registration.model';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegistrationManagerService {

  constructor(private authSvc: AuthService, private http: HttpClient) { }

  listUsers(): Observable<Array<UserProfileWithRegistration>>{
    return this.http.get<Array<UserProfileWithRegistration>>(
      `${this.baseUri()}/realm/${this.authSvc.globalConfig.realm}/pending`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  private baseUri(): string{
    return `http://docker.emf360.com:49145/api/v1/management`
  }
}
