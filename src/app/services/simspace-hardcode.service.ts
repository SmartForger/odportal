import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { UserDashboard } from '../models/user-dashboard.model';

@Injectable({
    providedIn: 'root'
})
export class SimspaceHardcodeService {

    dashboardIsSubbed: boolean;
    private eventId: string;
    private eventSub: BehaviorSubject<string>;

    constructor(private authSvc: AuthService, private http: HttpClient) {
        this.dashboardIsSubbed = false;
        this.eventId = '';
        this.eventSub = new BehaviorSubject<string>('');
        window.addEventListener("message", (event: MessageEvent) => {
            if (event.data.type && event.data.type === 'GET_CURRENT_EVENT' && this.eventId !== event.data.data.eventId) {
                this.eventId = event.data.data.eventId;
                this.eventSub.next(this.eventId);
            }
        }, false);
    }

    hasEventId(): boolean{return this.eventId !== undefined && this.eventId !== null && this.eventId !== '';}

    listMemberships(isTest: boolean = false): Observable<Array<SSMembership>>{
        return this.http.get<Array<SSMembership>>(
            `${this.authSvc.getCoreServicesMap()['eventsProxyServiceConnection']}api/v1/events/realm/${this.authSvc.userState.realm}/memberships${isTest ? '/test' : ''}`,
            {
                headers: this.authSvc.getAuthorizationHeader()
            }
        )
    }

    observeEventId(): Observable<string>{return this.eventSub.asObservable();}
}

export interface SSMembership{
    memberRole: string;
    admin: boolean;
    key: string;
    name: string;
}