import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GlobalConfig} from '../models/global-config.model';
import {UpdateConfig} from '../models/update-config.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private _apiBase: string;

  constructor(private http: HttpClient) { 
    this._apiBase = "http://localhost:49101/";
  }

  fetchConfig(): Observable<GlobalConfig> {
    return this.http.get<GlobalConfig>(this._apiBase);
  }

  updateConfig(updateConfig: UpdateConfig): Observable<GlobalConfig> {
    return this.http.put<GlobalConfig>(this._apiBase, updateConfig);
  }
}
