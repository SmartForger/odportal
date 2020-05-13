import { Component, OnInit, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { UserSession } from 'src/app/models/user-session';
import { DynamicallyRenderable } from 'src/app/interfaces/dynamically-renderable';
import { UserProfile, UserProfileKeycloak } from 'src/app/models/user-profile.model';
import { PasswordRequirements } from 'src/app/models/password-requirements.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { passwordRequirementsValidator } from '../../form-validators/custom-validators';
import { confirmationMatchValidator } from '../../form-validators/confirmation-match-validator';
import { CredentialsRepresentation } from 'src/app/models/credentials-representation.model';
import { UsersService } from 'src/app/services/users.service';
import { NotificationService } from 'src/app/notifier/notification.service';
import { NotificationType } from 'src/app/notifier/notificiation.model';
import { SessionTrackingServiceService } from 'src/app/services/session-tracking-service.service';
import { ClientSessionState } from 'src/app/models/client-session-state';
import { AuthService } from 'src/app/services/auth.service';
import { EventRepresentation } from 'src/app/models/event-representation';
import { Subscription } from 'rxjs';
import { EventFilterParams } from 'src/app/models/event-filter-params';
import { PageEvent, MatDialog } from '@angular/material';
import { DetailsDialogComponent } from '../../display-elements/details-dialog/details-dialog.component';
import { RealmEventsConfigRepresentation } from 'src/app/models/realm-events-config-representation';
import _ from "lodash";
import { PasswordDialogComponent } from '../password-dialog/password-dialog.component';

@Component({
    selector: 'app-security-and-access',
    templateUrl: './security-and-access.component.html',
    styleUrls: ['./security-and-access.component.scss']
})
export class SecurityAndAccessComponent implements DynamicallyRenderable, OnChanges, OnDestroy, OnInit {

    clients: string[];
    currentSession: UserSession;
    events: EventRepresentation[];
    eventsEnabled = false;
    filter: EventFilterParams = {};
    filteredEvents: EventRepresentation[];
    page: number;
    pagedEvents: EventRepresentation[];
    pageSize: number;
    passwordConfirmControl: FormControl;
    passwordControl: FormControl;
    passwordForm: FormGroup;
    profile: UserProfileKeycloak;
    sessions: Array<UserSession>;
    subscriptions: Subscription[];
    users: string[];
    
    readonly LOGINS_DISPLAYED_COLUMNS: Array<string> = ["time", "client", "action"];
    readonly PASSWORD_REQUIREMENTS: PasswordRequirements = {
        minLength: 15,
        uppers: 4,
        lowers: 4,
        numbers: 4,
        specials: 4
    };
    readonly SESSIONS_DISPLAYED_COLUMNS: Array<string> = ['address', 'geolocation', 'action']

    constructor(
        private dialog: MatDialog,
        private notificationSvc: NotificationService,
        private sessionSvc: SessionTrackingServiceService,
        private usersSvc: UsersService
    ) {
        this.clients = new Array<string>();
        this.currentSession = {id: '', username: '', userId: '', clientId: '', ipAddress: '192.168.5.42', start: 0, lastAccess: 0, geolocation: 'Orlando, Florida, US'};
        this.events = new Array<EventRepresentation>();
        this.filter = { };
        this.filteredEvents = new Array<EventRepresentation>();
        this.page = 0;
        this.pagedEvents = new Array<EventRepresentation>();
        this.pageSize = 10;
        this.passwordControl = new FormControl('', [passwordRequirementsValidator(this.PASSWORD_REQUIREMENTS), Validators.maxLength(250)]);
        this.passwordConfirmControl = new FormControl('', [confirmationMatchValidator(this.passwordControl), Validators.maxLength(250)]);
        this.passwordForm = new FormGroup({
            password: this.passwordControl,
            passwordConfirm: this.passwordConfirmControl
        });
        this.sessions = new Array<UserSession>();
        this.subscriptions = new Array<Subscription>();
        this.users = new Array<string>();

        this.subscriptions.push(
            this.sessionSvc.config.subscribe(
                (config: RealmEventsConfigRepresentation) => {
                    this.eventsEnabled = config.eventsEnabled;
                }
            )
        );
    }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.user && changes.user.currentValue) {
            this.sessionSvc.getEvents(changes.user.currentValue);
        }
    }

    ngOnDestroy(){
        this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
    }

    openPasswordDialog() {
        this.dialog.open(PasswordDialogComponent, {
            data: this.profile.id,
            disableClose: true
        });
    }

    changePassword(): void{
        if(this.passwordForm.valid){
            const creds: CredentialsRepresentation = {
                type: "password",
                value: this.passwordControl.value,
                temporary: false
            };
            this.usersSvc.updatePassword(this.profile.id, creds).subscribe(
                (response: any) => {
                    this.notificationSvc.notify({
                        type: NotificationType.Success,
                        message: "The password was updated successfully"
                    });
                },
                (err: any) => {
                    this.notificationSvc.notify({
                        type: NotificationType.Error,
                        message: "There was a problem while updaing the password"
                    });
                }
            );
        }
    }


    filterEvents(filter?: EventFilterParams) {
        if (filter) {
            this.filter = filter;
        }

        this.filteredEvents = this.events.filter(ev => {
            if (this.filter.dateFrom && +ev.time < this.filter.dateFrom.getTime()) {
                return false;
            }

            if (this.filter.dateTo && +ev.time >= this.filter.dateTo.getTime() + 86400000) {
                return false;
            }

            return ["clientId", "userId"].every(
                field => !this.filter[field] || ev[field] === this.filter[field]
            );
        });

        this.page = 0;
        this.paginate();
    }

    openDetails(details: Object) {
        this.dialog.open(DetailsDialogComponent, {
            data: {
                details,
                title: "Details"
            }
        });
    }

    paginate(ev?: PageEvent) {
        if (ev) {
            this.page = ev.pageIndex;
            this.pageSize = ev.pageSize;
        }

        const start = this.page * this.pageSize;
        this.pagedEvents = this.filteredEvents.slice(start, start + this.pageSize);
    }

    setState(state: any): void{
        this.profile = state;

        // this.sessionSvc.clearEvents().subscribe(() => {
        // });

        this.subscriptions.push(
            this.sessionSvc.events.subscribe(
                (events: EventRepresentation[]) => {
                    this.events = events;
                    this.clients = _.uniq(events.map(ev => ev.clientId || ""));
                    this.users = _.uniq(events.map(ev => ev.userId));
                    this.filterEvents();
                }
            )
        );

        this.sessionSvc.getEvents(this.profile.id);
    };

    terminate(session: UserSession): void{ }

    terminateAll(): void{ }
}
