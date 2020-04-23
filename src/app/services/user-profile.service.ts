import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfileKeycloak, UserProfile } from '../models/user-profile.model';
import { GlobalConfig } from '../models/global-config.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

    id: string;

    constructor(private authSvc: AuthService, private http: HttpClient) {
        const configSub = this.authSvc.observeLoggedInUpdates().subscribe(() => {
            this.id = this.authSvc.getUserId();
            configSub.unsubscribe();
        });
    }

    addAltEmail(email: string, userId: string = null): Observable<UserProfile>{
        if(userId === null){
            userId = this.id;
        }

        return this.http.post<UserProfile>(
            `${this.baseUri()}${userId}/add-alt-email`,
            {
                email: email
            },
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    getProfile(userId: string = null): Observable<UserProfile>{
        if(userId === null){
            userId = this.id;
        }

        return this.http.get<UserProfile>(
            `${this.baseUri()}${userId}`,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    isUniqueEmail(email: string): Observable<boolean>{
        return this.http.post<boolean>(
            `${this.baseUri()}${this.id}/is-unique-email`,
            {email: email},
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    removeAltEmail(email: string, userId: string = null): Observable<UserProfile>{
        if(userId === null){
            userId = this.id;
        }

        return this.http.post<UserProfile>(
            `${this.baseUri()}${userId}/remove-alt-email`,
            {email: email},
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }
    
    private baseUri(): string{
        return `${this.authSvc.globalConfig.userProfileServiceConnection}api/v1/user-profile/realm/${this.authSvc.globalConfig.realm}/user-id/`
    }
}
