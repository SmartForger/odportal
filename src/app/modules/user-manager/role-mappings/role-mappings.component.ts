import { Component, OnInit, OnDestroy } from '@angular/core';
import { DynamicallyRenderable } from 'src/app/interfaces/dynamically-renderable';
import { UserProfile, UserProfileKeycloak } from 'src/app/models/user-profile.model';
import { Role } from 'src/app/models/role.model';
import { UsersService } from 'src/app/services/users.service';
import { forkJoin, Subscription } from 'rxjs';
import { AppPermissionsBroker } from 'src/app/util/app-permissions-broker';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-role-mappings',
    templateUrl: './role-mappings.component.html',
    styleUrls: ['./role-mappings.component.scss']
})
export class RoleMappingsComponent implements DynamicallyRenderable, OnDestroy, OnInit {

    canManage: boolean;
    hasRole: Array<boolean>;
    get profile(): UserProfileKeycloak{return this._profile;}
    set profile(profile: UserProfileKeycloak){this.setProfile(profile);}
    private _profile: UserProfileKeycloak;
    roles: Array<Role>;

    private broker: AppPermissionsBroker;
    private sessionUpdateSub: Subscription;
    private readonly APP_ID = 'role-mappings';

    constructor(
        private authSvc: AuthService,
        private userSvc: UsersService
    ) {
        this.broker = new AppPermissionsBroker(this.APP_ID);
        this.roles = new Array<Role>();
    }

    ngOnInit() {
        this.canManage = this.broker.hasPermission("manage");
        this.subscribeToSessionUpdate();
    }

    ngOnDestroy() {
        if(this.sessionUpdateSub){
            this.sessionUpdateSub.unsubscribe();
        }
    }

    setState(state: any): void{
        this.profile = state;
    }

    toggleAssignation(role: Role, roleIndex: number): void{
        this.hasRole[roleIndex] = !this.hasRole[roleIndex];
        if(this.canManage){
            if(this.hasRole[roleIndex]){
                this.userSvc.addComposites(this.profile.id, [role]).subscribe();
            }
            else{
                this.userSvc.deleteComposites(this.profile.id, [role]).subscribe();
            }
        }
    }

    private loadRoles(): void{
        forkJoin(
            this.userSvc.listAvailableRoles(this.profile.id),
            this.userSvc.listAssignedRoles(this.profile.id)
        ).subscribe((results: Array<Array<Role>>) => {
            if(this.canManage){
                this.roles = Array.from(results[0]).concat(results[1]).sort((a: Role, b: Role) => {return a.name.localeCompare(b.name);});
                this.hasRole = new Array();
                this.roles.forEach((role: Role, index: number) => {
                    let assigned = results[1].find((assignedRole: Role) => {return assignedRole.id === role.id;});
                    this.hasRole[index] = assigned !== undefined;
                });
            }
            else{
                this.roles = results[1].sort((a: Role, b: Role) => {return a.name.localeCompare(b.name);});;
                this.hasRole = new Array();
                this.roles.forEach((r: Role) => {this.hasRole.push(true);});
            }
        });
    }

    private setProfile(profile: UserProfileKeycloak): void{
        this._profile = profile;
        this.loadRoles();
    }

    private subscribeToSessionUpdate(): void {
        this.sessionUpdateSub = this.authSvc.observeUserSessionUpdates().subscribe((userId: string) => {
            if (userId === this.authSvc.getUserId()) {
                this.canManage = this.broker.hasPermission("manage");
                if(this.profile !== undefined){
                    this.loadRoles();
                }
            }
        });
    }
}
