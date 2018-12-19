import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient, private authSvc: AuthService) { }

  list(): Observable<any> {
    const headers = {
      Authorization: "Bearer " + this.authSvc.getAccessToken()
    }
    return this.http.get<any>(this.authSvc.globalConfig.ssoConnection + 'auth/admin/realms/my-realm/roles', {headers: headers});
  }
}
