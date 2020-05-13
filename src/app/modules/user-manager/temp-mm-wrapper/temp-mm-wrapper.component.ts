import { Component, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DynamicallyRenderable } from 'src/app/interfaces/dynamically-renderable';
import { UserProfile, UserProfileKeycloak } from 'src/app/models/user-profile.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserState } from 'src/app/models/user-state.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-temp-mm-wrapper',
    templateUrl: './temp-mm-wrapper.component.html',
    styleUrls: ['./temp-mm-wrapper.component.scss']
})
export class TempMmWrapperComponent implements AfterViewInit, DynamicallyRenderable, OnDestroy {

    @ViewChild('hook') hook: ElementRef;

    private initCallback: (init) => void;
    private mmEl: any;
    private profile: UserProfileKeycloak;
    private stateCallback: (state: UserProfileKeycloak) => void;
    private userStateCallback: (userState: UserState) => void;
    private userStateSubscription: Subscription;

    constructor(private authSvc: AuthService) {
        console.log('initial token: ', this.authSvc.userState);
        this.userStateSubscription = this.authSvc.observeUserSessionUpdates().subscribe((userId: string) => {
            if(this.userStateCallback && userId === this.profile.id){
                this.userStateCallback(this.authSvc.userState);
            }
        });
    }

    ngAfterViewInit(){
        this.mmEl = document.createElement('uae-mattermost');

        this.mmEl.addEventListener('onContainerStateCallback', function(event: CustomEvent){
            this.stateCallback = event.detail.callback;
            if(this.profile !== undefined){
                this.stateCallback(this.profile);
            }
        }.bind(this));

        this.mmEl.addEventListener('onInitCallback', function(event: CustomEvent){
            this.initCallback = event.detail.callback;
            let init = {
                coreServices: this.authSvc.getCoreServicesMap(),
                userState: this.authSvc.userState
            };
            this.initCallback(init);
        }.bind(this));

        this.mmEl.addEventListener('onUserStateCallback', function(event: CustomEvent){
            this.userStateCallback = event.detail.callback;
        }.bind(this));

        this.hook.nativeElement.appendChild(this.mmEl);
    }

    ngOnDestroy(){
        if(this.userStateSubscription){
            this.userStateSubscription.unsubscribe();
        }
    }

    setState(state: UserProfileKeycloak): void{
        this.profile = state;
        if(this.stateCallback){
            this.stateCallback(this.profile);
        }
    };
}
