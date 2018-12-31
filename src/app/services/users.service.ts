import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Role} from '../models/role.model';
import {AuthService} from './auth.service';
import {UserProfile} from '../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  userSubject: Subject<UserProfile>;

  constructor(private http: HttpClient, private authSvc: AuthService) { 
    this.userSubject = new Subject<UserProfile>();
  }

  listComposites(userId: string): Observable<Array<Role>> {
    return this.http.get<Array<Role>>(
      this.createBaseAPIUrl() + '/' + userId + '/role-mappings/realm/composite',
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }  

  listAvailableRoles(userId: string): Observable<Array<Role>> {
    return this.http.get<Array<Role>>(
      this.createBaseAPIUrl() + '/' + userId + '/role-mappings/realm/available',
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  fetchById(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(
      this.createBaseAPIUrl() + '/' + userId,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  update(user: UserProfile): Observable<any> {
    return this.http.put<any>(
      this.createBaseAPIUrl() + '/' + user.id,
      user,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  userUpdated(user: UserProfile): void {
    this.userSubject.next(user);
  }

  deleteComposites(userId: string, roles: Array<Role>): Observable<any> {
    const options = {
      headers: this.authSvc.getAuthorizationHeader(),
      body: roles
    };
    return this.http.delete<any>(
      this.createBaseAPIUrl() + '/' + userId + '/role-mappings/realm',
      options
    );
  }

  addComposites(userId: string, roles: Array<Role>): Observable<any> {
    return this.http.post<any>(
      this.createBaseAPIUrl() + '/' + userId + '/role-mappings/realm',
      roles,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  private createBaseAPIUrl(): string {
    return this.authSvc.globalConfig.ssoConnection + 'auth/admin/realms/' + this.authSvc.globalConfig.realm + '/users';
  }
}
