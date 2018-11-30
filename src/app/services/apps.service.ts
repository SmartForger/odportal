import { Injectable } from '@angular/core';
import {TestableService} from '../interfaces/testable-service';
import {Observable} from 'rxjs';
import {ApiResponse} from '../models/api-response.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppsService implements TestableService {

  constructor(private http: HttpClient) { }

  test(route: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(route + 'test');
  }
}
