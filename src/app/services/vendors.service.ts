import { Injectable } from '@angular/core';
import {TestableService} from '../interfaces/testable-service';
import {Observable} from 'rxjs';
import {ApiResponse} from '../models/api-response.model';
import {HttpClient, HttpRequest, HttpEvent} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Vendor} from '../models/vendor.model';

@Injectable({
  providedIn: 'root'
})
export class VendorsService implements TestableService {

  constructor(private http: HttpClient, private authSvc: AuthService) { 
    
  }

  test(route: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(route + 'api/v1/test');
  }

  listVendorsByUserId(userId: string): Observable<Array<Vendor>> {
    return this.http.get<Array<Vendor>>(
      this.createBaseAPIUrl() + 'realm/' + this.authSvc.globalConfig.realm + '/user/' + userId,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  listVendors(): Observable<Array<Vendor>> {
    return this.http.get<Array<Vendor>>(
      this.createBaseAPIUrl() + `realm/${this.authSvc.globalConfig.realm}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  fetchByUserAndVendorId(userId: string, vendorId: string): Observable<Vendor> {
    return this.http.get<Vendor>(
      this.createBaseAPIUrl() + `realm/${this.authSvc.globalConfig.realm}/vendor/${vendorId}/user/${userId}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  fetchById(vendorId: string): Observable<Vendor> {
    return this.http.get<Vendor>(
      this.createBaseAPIUrl() + `realm/${this.authSvc.globalConfig.realm}/vendor/${vendorId}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  createVendor(vendor: Vendor): Observable<Vendor> {
    return this.http.post<Vendor>(
      this.createBaseAPIUrl() + `realm/${this.authSvc.globalConfig.realm}`,
      vendor,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  updateVendor(vendor: Vendor): Observable<Vendor> {
    return this.http.put<Vendor>(
      this.createBaseAPIUrl() + `realm/${this.authSvc.globalConfig.realm}/vendor/${vendor.docId}`,
      vendor,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    )
  }

  updateVendorLogo(vendorId: string, logo: File): Observable<HttpEvent<Vendor>> {
    let formData = new FormData();
    formData.append("vendorId", vendorId);
    let req: HttpRequest<FormData> = new HttpRequest<FormData>(
      "POST",
      this.createBaseAPIUrl() + `realm/${this.authSvc.globalConfig.realm}/vendor/${vendorId}/logo`,
      formData,
      {
        headers: this.authSvc.getAuthorizationHeader(true),
        reportProgress: true
      }
    );
    return this.http.request<Vendor>(req);
  } 

  deleteVendor(vendorId: string): Observable<Vendor> {
    return this.http.delete<Vendor>(
      this.createBaseAPIUrl() + `realm/${this.authSvc.globalConfig.realm}/vendor/${vendorId}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  private createBaseAPIUrl(): string {
    return this.authSvc.globalConfig.vendorsServiceConnection + 'api/v1/vendors/';
  }
}
