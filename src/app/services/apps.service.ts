import { Injectable } from '@angular/core';
import {TestableService} from '../interfaces/testable-service';
import {Observable} from 'rxjs';
import {ApiResponse} from '../models/api-response.model';
import {HttpClient} from '@angular/common/http';
import {AdminCredentials} from '../models/admin-credentials.model';
import {App} from '../models/app.model';

@Injectable({
  providedIn: 'root'
})
export class AppsService implements TestableService {

  constructor(private http: HttpClient) { }

  test(route: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(route + 'api/v1/test');
  }

  setup(route: string, creds: AdminCredentials): Observable<Array<App>> {
    return this.http.post<Array<App>>(
      route + 'api/v1/setup',
      creds
    );
  }
}
