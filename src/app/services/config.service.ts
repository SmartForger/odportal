import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GlobalConfig} from '../models/global-config.model';
import {UpdateConfig} from '../models/update-config.model';
import {environment as env} from '../../environments/environment';
import { AdminCredentials } from '../models/admin-credentials.model';
import {RealmRepresentation} from '../models/realm-representation.model';

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

  setup(updateConfig: UpdateConfig): Observable<GlobalConfig> {
    return this.http.post<GlobalConfig>(this._apiBase + '/setup', updateConfig);
  }
}
