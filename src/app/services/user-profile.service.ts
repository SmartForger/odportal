import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfileKeycloak, UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

    constructor(private authSvc: AuthService, private http: HttpClient) { }

    addAltEmail(email: string): Observable<UserProfile>{
        return this.http.post<UserProfile>(
            `${this.baseUri()}/add-alt-email`,
            {email: email},
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    getProfile(): Observable<UserProfile>{
        return this.http.get<UserProfile>(
            `${this.baseUri()}`,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    isUniqueEmail(email: string): Observable<boolean>{
        return this.http.post<boolean>(
            `${this.baseUri()}/is-unique-email`,
            {email: email},
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    removeAltEmail(email: string): Observable<UserProfile>{
        return this.http.post<UserProfile>(
            `${this.baseUri()}/remove-alt-email`,
            {email: email},
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }
    
    private baseUri(): string{
        //return `${this.authSvc.globalConfig.registrationServiceConnection}/users`;
        let id = this.authSvc.getUserId();
        return `${this.authSvc.globalConfig.userProfileServiceConnection}api/v1/user-profile/realm/${this.authSvc.globalConfig.realm}/user-id/${id}`
    }
}
