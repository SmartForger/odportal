import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Client} from '../models/client.model';
import {Role} from '../models/role.model';
import {KeyValue} from '../models/key-value.model';
import {KeyValueGen} from '../interfaces/key-value-gen';

@Injectable({
  providedIn: 'root'
})
export class ClientsService implements KeyValueGen {

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

  generateKeyValues(): Observable<Array<KeyValue>> {
    return new Observable<Array<KeyValue>>(observer => {
      this.list().subscribe(
        (clients: Array<Client>) => {
          const kv: Array<KeyValue> = clients.map((client: Client, index: number) => {
            return {display: client.clientId, value: client.id};
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

  private createBaseAPIUrl(): string {
    return this.authSvc.globalConfig.ssoConnection + 'auth/admin/realms/' + this.authSvc.globalConfig.realm + '/clients';
  }

}
