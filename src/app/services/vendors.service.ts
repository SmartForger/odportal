import { Injectable } from '@angular/core';
import {TestableService} from '../interfaces/testable-service';
import {Observable} from 'rxjs';
import {ApiResponse} from '../models/api-response.model';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Vendor} from '../models/vendor.model';

@Injectable({
  providedIn: 'root'
})
export class VendorsService implements TestableService {

  constructor(private http: HttpClient, private authSvc: AuthService) { }

  test(route: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(route + 'api/v1/test');
  }

  fetchByUserId(userId: string): Observable<Vendor> {
    return this.http.get<Vendor>(
      this.createBaseAPIUrl() + '/realm/' + this.authSvc.globalConfig.realm + '/user/' + userId,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  private createBaseAPIUrl(): string {
    return this.authSvc.globalConfig.vendorsServiceConnection + 'api/v1/vendors/';
  }
}
