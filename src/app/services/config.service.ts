/**
 * @description Retrieves the configuration document that contains settings and connection information for the framework, such as the URLs for core services.
 * @author Steven M. Redman
 */

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GlobalConfig} from '../models/global-config.model';
import {environment as env} from '../../environments/environment';

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
}
