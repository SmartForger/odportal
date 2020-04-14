import { Component, OnInit } from '@angular/core';
import { UserSession } from 'src/app/models/user-session';
import { DynamicallyRenderable } from 'src/app/interfaces/dynamically-renderable';
import { UserProfile } from 'src/app/models/user-profile.model';

@Component({
    selector: 'app-security-and-access',
    templateUrl: './security-and-access.component.html',
    styleUrls: ['./security-and-access.component.scss']
})
export class SecurityAndAccessComponent implements DynamicallyRenderable, OnInit {

    currentSession: UserSession;
    profile: UserProfile;
    sessions: Array<UserSession>;

    readonly DISPLAYED_COLUMNS = ['address', 'geolocation', 'action']

    constructor() {
        this.currentSession = {id: '', username: '', userId: '', clientId: '', ipAddress: '192.168.5.42', start: 0, lastAccess: 0, geolocation: 'Orlando, Florida, US'};
        this.sessions = [
            {id: '', username: '', userId: '', clientId: '', ipAddress: '192.168.5.42', start: 0, lastAccess: 0, geolocation: 'Orlando, Florida, US'},
            {id: '', username: '', userId: '', clientId: '', ipAddress: '50.54.30.255', start: 0, lastAccess: 0, geolocation: 'Cleveland, Ohio, US'}
        ];
    }

    ngOnInit() { }

    setState(state: any): void{
        this.profile = state;
    };

    terminate(session: UserSession): void{

    }

    terminateAll(): void{
        
    }
}
