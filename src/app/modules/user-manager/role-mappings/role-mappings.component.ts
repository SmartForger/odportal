import { Component, OnInit } from '@angular/core';
import { DynamicallyRenderable } from 'src/app/interfaces/dynamically-renderable';
import { UserProfile } from 'src/app/models/user-profile.model';
import { RolesService } from 'src/app/services/roles.service';
import { Role } from 'src/app/models/role.model';
import { UsersService } from 'src/app/services/users.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-role-mappings',
    templateUrl: './role-mappings.component.html',
    styleUrls: ['./role-mappings.component.scss']
})
export class RoleMappingsComponent implements DynamicallyRenderable, OnInit {

    get profile(): UserProfile{return this._profile;}
    set profile(profile: UserProfile){this.setProfile(profile);}
    private _profile: UserProfile;
    roles: Array<Role>;
    hasRole: Array<boolean>;

    constructor(private userSvc: UsersService) {
        this.roles = new Array<Role>();
    }

    ngOnInit() { }

    setState(state: any): void{
        this.profile = state;
    }

    toggleAssignation(role: Role, roleIndex: number): void{
        this.hasRole[roleIndex] = !this.hasRole[roleIndex];
    }

    private setProfile(profile: UserProfile): void{
        forkJoin(
            this.userSvc.listAvailableRoles(profile.userId),
            this.userSvc.listAssignedRoles(profile.userId)
        ).subscribe((results: Array<Array<Role>>) => {
            console.log('results: ...', results);
            this._profile = profile;
            this.roles = Array.from(results[0]).concat(results[1]).sort((a: Role, b: Role) => {return a.name.localeCompare(b.name);});
            this.hasRole = new Array();
            this.roles.forEach((role: Role, index: number) => {
                let assigned = results[1].find((assignedRole: Role) => {return assignedRole.id === role.id;});
                this.hasRole[index] = assigned !== undefined;
            });
        });
    }
}
