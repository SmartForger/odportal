import { Injectable } from '@angular/core';
import { Registration, RegistrationSummaryFields } from '../models/registration.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RegistrationService {

    constructor(private http: HttpClient, private authSvc: AuthService) { }

    fetchDefault(): Observable<Registration> {
        console.log(this.authSvc.globalConfig);
        return this.http.get<Registration>(
            `${this.baseUri()}/default`,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    listProcesses(): Observable<Array<Registration>> {
        return this.http.get<Array<Registration>>(
            `${this.baseUri()}/list`,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        )
    }

    summaryFields(id: string): Observable<RegistrationSummaryFields> {
        return this.http.get<RegistrationSummaryFields>(
            `${this.baseUri()}/process-id/${id}/summary-fields`,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        );
    }

    get(id: string): Observable<Registration>{
        return this.http.get<Registration>(
            `${this.baseUri()}/process-id/${id}`,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        )
    }

    private baseUri(): string {
        return `${this.authSvc.globalConfig.registrationServiceConnection}api/v1/registrations`;
    }
}
