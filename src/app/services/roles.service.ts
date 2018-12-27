import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Role} from '../models/role.model';
import {UserProfile} from '../models/user-profile.model';
import {KeyValueGen} from '../interfaces/key-value-gen';
import {KeyValue} from '../models/key-value.model';

@Injectable({
  providedIn: 'root'
})
export class RolesService implements KeyValueGen {

  constructor(private http: HttpClient, private authSvc: AuthService) { }

  list(): Observable<Array<Role>> {
    return this.http.get<Array<Role>>(
      this.createBaseAPIUrl(),
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  fetchByName(name: string): Observable<Role> {
    return this.http.get<Role>(
      this.createBaseAPIUrl() + '/' + name,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  listComposites(roleId: string, clientId: string): Observable<Array<Role>> {
    return this.http.get<Array<Role>>(
      this.createBaseAPIUrl() + '-by-id/' + roleId + '/composites/clients/' + clientId,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  listUsers(roleName: string): Observable<Array<UserProfile>> {
    return this.http.get<Array<UserProfile>>(
      this.createBaseAPIUrl() + '/' + roleName + '/users',
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  generateKeyValues(): Observable<Array<KeyValue>> {
    return new Observable<Array<KeyValue>>(observer => {
      this.list().subscribe(
        (roles: Array<Role>) => {
          const kv: Array<KeyValue> = roles.filter((role: Role) => {
            return role.id !== "pending";
          }).map((role: Role, index: number) => {
            return {display: role.name, value: role.name};
          });
          observer.next(kv);
          observer.complete();
        },
        (err: any) => {
          observer.next(new Array<KeyValue>());
          observer.complete();
        }
      );
    });
  }

  create(role: Role): Observable<any> {
    return this.http.post<any>(
      this.createBaseAPIUrl(),
      role,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  update(role: Role): Observable<any> {
    return this.http.put<any>(
      this.createBaseAPIUrl() + '-by-id/' + role.id,
      role,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  delete(roleId: string): Observable<any> {
    return this.http.delete<any>(
      this.createBaseAPIUrl() + '-by-id/' + roleId,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  deleteComposites(roleId: string, roles: Array<Role>): Observable<any> {
    const options = {
      headers: this.authSvc.getAuthorizationHeader(),
      body: roles
    };
    return this.http.delete<any>(
      this.createBaseAPIUrl() + '-by-id/' + roleId + '/composites',
      options
    );
  }

  addComposites(roleId: string, roles: Array<Role>): Observable<any> {
    return this.http.post<any>(
      this.createBaseAPIUrl() + '-by-id/' + roleId + '/composites',
      roles,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  private createBaseAPIUrl(): string {
    return this.authSvc.globalConfig.ssoConnection + 'auth/admin/realms/' + this.authSvc.globalConfig.realm + '/roles';
  }

}
