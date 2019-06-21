import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationFilesService {

  constructor(private authSvc: AuthService, private http: HttpClient) { }

  uploadFiles(regId: string, formId: string, data: FormData): Observable<any>{
    return this.http.post(
      `${this.baseUri()}/registration/${regId}/form/${formId}`,
      data,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    )
  }

  private baseUri(): string{
    return `${this.authSvc.globalConfig.registrationServiceConnection}api/v1/attachments/realm/${this.authSvc.globalConfig.realm}`;
  }
}
