import { Injectable } from '@angular/core';
import {TestableService} from '../interfaces/testable-service';
import {Observable} from 'rxjs';
import {ApiResponse} from '../models/api-response.model';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Vendor} from '../models/vendor.model';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorsService implements TestableService {

  activeVendorSubject: BehaviorSubject<Vendor>;

  constructor(private http: HttpClient, private authSvc: AuthService) { 
    this.activeVendorSubject = new BehaviorSubject<Vendor>(null);
  }

  test(route: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(route + 'api/v1/test');
  }

  fetchVendorByBearerToken(): Observable<Vendor> {
    return this.http.get<Vendor>(
      this.createBaseAPIUrl() + 'realm/' + this.authSvc.globalConfig.realm + '/user',
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  setActiveVendor(vendor: Vendor): void {
    this.activeVendorSubject.next(vendor);
  }

  private createBaseAPIUrl(): string {
    return this.authSvc.globalConfig.vendorsServiceConnection + 'api/v1/vendors/';
  }
}
