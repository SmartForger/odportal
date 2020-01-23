/**
 * @description Performs CRUD operations on vendors and facilitates uploading vendor logos.
 * @author Steven M. Redman
 */

import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpRequest, HttpEvent, HttpParams} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Vendor} from '../models/vendor.model';
import {ApiSearchCriteria} from '../models/api-search-criteria.model';
import {ApiSearchResult} from '../models/api-search-result.model';

@Injectable({
  providedIn: 'root'
})
export class VendorsService {

  constructor(private http: HttpClient, private authSvc: AuthService) { 
    
  }

  listVendorsByUserId(userId: string, search: ApiSearchCriteria): Observable<ApiSearchResult<Vendor>> {
    return this.http.get<ApiSearchResult<Vendor>>(
      `${this.createBaseAPIUrl()}realm/${this.authSvc.globalConfig.realm}/user/${userId}`,
      {
        headers: this.authSvc.getAuthorizationHeader(),
        params: search.asHttpParams()
      }
    );
  }

  listVendorsByUserIds(search: ApiSearchCriteria): Observable<ApiSearchResult<Vendor>> {
    return this.http.get<ApiSearchResult<Vendor>>(
      `${this.createBaseAPIUrl()}realm/${this.authSvc.globalConfig.realm}/users`,
      {
        headers: this.authSvc.getAuthorizationHeader(),
        params: search.asHttpParams()
      }
    );
  }

  listVendors(search: ApiSearchCriteria): Observable<ApiSearchResult<Vendor>> {
    return this.http.get<ApiSearchResult<Vendor>>(
      `${this.createBaseAPIUrl()}realm/${this.authSvc.globalConfig.realm}`,
      {
        headers: this.authSvc.getAuthorizationHeader(),
        params: search.asHttpParams()
      }
    );
  }

  fetchByUserAndVendorId(userId: string, vendorId: string): Observable<Vendor> {
    return this.http.get<Vendor>(
      `${this.createBaseAPIUrl()}realm/${this.authSvc.globalConfig.realm}/vendor/${vendorId}/user/${userId}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  fetchById(vendorId: string): Observable<Vendor> {
    return this.http.get<Vendor>(
      `${this.createBaseAPIUrl()}realm/${this.authSvc.globalConfig.realm}/vendor/${vendorId}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  createVendor(vendor: Vendor): Observable<Vendor> {
    return this.http.post<Vendor>(
      `${this.createBaseAPIUrl()}realm/${this.authSvc.globalConfig.realm}`,
      vendor,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  updateVendor(vendor: Vendor): Observable<Vendor> {
    return this.http.put<Vendor>(
      `${this.createBaseAPIUrl()}realm/${this.authSvc.globalConfig.realm}/vendor/${vendor.docId}`,
      vendor,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    )
  }

  updateVendorLogo(vendorId: string, logo: File): Observable<HttpEvent<Vendor>> {
    let formData = new FormData();
    formData.append("vendorId", vendorId);
    formData.append("logo", logo);
    let req: HttpRequest<FormData> = new HttpRequest<FormData>(
      "POST",
      `${this.createBaseAPIUrl()}realm/${this.authSvc.globalConfig.realm}/vendor/${vendorId}/logo`,
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
      `${this.createBaseAPIUrl()}realm/${this.authSvc.globalConfig.realm}/vendor/${vendorId}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  private createBaseAPIUrl(): string {
    return `${this.authSvc.globalConfig.vendorsServiceConnection}api/v1/vendors/`;
  }
}
