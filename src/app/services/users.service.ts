/**
 * @description Performs CRUD operations on SSO users and provides interfaces for adding/removing realm-level composites
 * @author Steven M. Redma
 */

import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Role} from '../models/role.model';
import {AuthService} from './auth.service';
import {UserProfile} from '../models/user-profile.model';
import {CredentialsRepresentation} from '../models/credentials-representation.model';
import { UserRepresentation } from '../models/user-representation.model';
import {UserSearch} from '../models/user-search.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient, private authSvc: AuthService) { }

  listComposites(userId: string): Observable<Array<Role>> {
    return this.http.get<Array<Role>>(
      `${this.createBaseAPIUrl()}/${userId}/role-mappings/realm/composite`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }  

  listAssignedRoles(userId: string): Observable<Array<Role>> {
    return this.http.get<Array<Role>>(
      `${this.createBaseAPIUrl()}/${userId}/role-mappings/realm`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  listAvailableRoles(userId: string): Observable<Array<Role>> {
    return this.http.get<Array<Role>>(
      `${this.createBaseAPIUrl()}/${userId}/role-mappings/realm/available`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  listClientComposites(userId: string, clientId: string): Observable<Array<Role>> {
    return this.http.get<Array<Role>>(
      `${this.createBaseAPIUrl()}/${userId}/role-mappings/clients/${clientId}/composite`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  listUsers(search: UserSearch): Observable<Array<UserProfile>> {
    let params: HttpParams = new HttpParams();
    for (let key in search) {
      if (search[key]) {
        params = params.set(key, search[key]);
      }
    }
    return this.http.get<Array<UserProfile>>(
      this.createBaseAPIUrl(),
      {
        headers: this.authSvc.getAuthorizationHeader(),
        params: params
      }
    );
  }

  fetchById(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(
      `${this.createBaseAPIUrl()}/${userId}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  create(userRep: UserRepresentation): Observable<any> {
    return this.http.post<any>(
      this.createBaseAPIUrl(),
      userRep,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  updateProfile(user: UserProfile): Observable<any> {
    return this.http.put<any>(
      `${this.createBaseAPIUrl()}/${user.id}`,
      user,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  updatePassword(userId: string, creds: CredentialsRepresentation): Observable<any> {
    return this.http.put<any>(
      `${this.createBaseAPIUrl()}/${userId}/reset-password`,
      creds,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  delete(userId: string): Observable<any> {
    return this.http.delete<any>(
      `${this.createBaseAPIUrl()}/${userId}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  deleteComposites(userId: string, roles: Array<Role>): Observable<any> {
    const options = {
      headers: this.authSvc.getAuthorizationHeader(),
      body: roles
    };
    return this.http.delete<any>(
      `${this.createBaseAPIUrl()}/${userId}/role-mappings/realm`,
      options
    );
  }

  addComposites(userId: string, roles: Array<Role>): Observable<any> {
    return this.http.post<any>(
      `${this.createBaseAPIUrl()}/${userId}/role-mappings/realm`,
      roles,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  private createBaseAPIUrl(): string {
    return `${this.authSvc.globalConfig.ssoConnection}auth/admin/realms/${this.authSvc.globalConfig.realm}/users`;
  }
}
