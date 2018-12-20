import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Client} from '../models/client.model';
import {Role} from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private http: HttpClient, private authSvc: AuthService) { }

  list(): Observable<Array<Client>> {
    return this.http.get<Array<Client>>(
      this.createBaseAPIUrl(),
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  listRoles(id: string): Observable<Array<Role>> {
    return this.http.get<Array<Role>>(
      this.createBaseAPIUrl() + '/' + id + '/roles',
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  private createBaseAPIUrl(): string {
    return this.authSvc.globalConfig.ssoConnection + 'auth/admin/realms/' + this.authSvc.globalConfig.realm + '/clients';
  }

}
