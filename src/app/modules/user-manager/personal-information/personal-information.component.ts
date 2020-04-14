import { Component, OnInit } from '@angular/core';
import { DynamicallyRenderable } from 'src/app/interfaces/dynamically-renderable';
import { UserProfile } from 'src/app/models/user-profile.model';
import { UsersService } from 'src/app/services/users.service';
import { Cloner } from '../../../util/cloner';

@Component({
    selector: 'app-personal-information',
    templateUrl: './personal-information.component.html',
    styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements DynamicallyRenderable, OnInit {

    profile: UserProfile;
    profileShared: UserProfile;

    constructor(private userSvc: UsersService) {
        this.profile = {
            email: '',
            firstName: '',
            lastName: '',
            username: ''
        };
    }

    ngOnInit() {
    }

    cancel(): void{
        this.profile = Cloner.cloneObject(this.profileShared);
    }

    setState(state: any): void {
        this.profileShared = state;
        this.profile = Cloner.cloneObject(state);
    }

    update(): void{
        this.userSvc.updateProfile(this.profile).subscribe();
        this.profileShared.email = this.profile.email;
        this.profileShared.firstName = this.profile.firstName;
        this.profileShared.lastName = this.profile.lastName;
        this.profileShared.username = this.profile.username;
    }
}
