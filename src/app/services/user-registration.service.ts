import { Injectable } from '@angular/core';
import { UserRegistration } from '../models/user-registration.model';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Form } from '../models/form.model';


@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {

  constructor(private authSvc: AuthService, private http: HttpClient) { }

  getUserRegistration(regId: string): Observable<UserRegistration>{
    return this.http.get<UserRegistration>(
      `${this.baseUri()}/${regId}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    )
  }

  submitForm(regId: string, form: Form): Observable<Form>{
    return this.http.post<Form>(
      `${this.baseUri()}/${regId}/submit-form`,
      form,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    )
  }

  private baseUri(): string{
    //return `${this.authSvc.globalConfig.registrationServiceConnection}/users`;
    return `http://docker.emf360.com:49145/api/v1/users`
  }
}
