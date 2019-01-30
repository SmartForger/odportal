import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GlobalConfig} from '../models/global-config.model';
import {UpdateConfig} from '../models/update-config.model';
import {environment as env} from '../../environments/environment';
import { AdminCredentials } from '../models/admin-credentials.model';
import {RealmRepresentation} from '../models/realm-representation.model';
import {Client} from '../models/client.model';
import {RoleRepresentation} from '../models/role-representation.model';
import {ConfigWithClients} from '../models/config-with-clients.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private _apiBase: string;

  constructor(private http: HttpClient) { 
    this._apiBase = env.configSvcApi;
  }

  fetchConfig(): Observable<GlobalConfig> {
    return this.http.get<GlobalConfig>(this._apiBase);
  }

  listRealms(creds: AdminCredentials): Observable<Array<RealmRepresentation>> {
    return this.http.post<Array<RealmRepresentation>>(this._apiBase + '/realms', creds);
  }

  listClients(creds: AdminCredentials, realm: string): Observable<Array<Client>> {
    return this.http.post<Array<Client>>(this._apiBase + '/clients', {creds: creds, realm: realm});
  }

  listRoles(creds: AdminCredentials, realm: string): Observable<Array<RoleRepresentation>> {
    return this.http.post<Array<RoleRepresentation>>(this._apiBase + '/roles', {creds: creds, realm: realm});
  }

  setupNewRealm(updateConfig: UpdateConfig): Observable<ConfigWithClients> {
    return this.http.post<ConfigWithClients>(this._apiBase + '/setup', updateConfig);
  }

  setupExistingRealm(updateConfig: UpdateConfig): Observable<ConfigWithClients> {
    return this.http.post<ConfigWithClients>(this._apiBase + '/setup/existing', updateConfig);
  }
}
