import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Role} from '../models/role.model';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient, private authSvc: AuthService) { }

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
