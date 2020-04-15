import { Component, OnInit, Input } from '@angular/core';
import { AppIconType } from 'src/app/models/app.model';
import { Container } from 'src/app/models/container.model';
import { UsersService } from 'src/app/services/users.service';
import { UserProfileKeycloak, UserProfile } from 'src/app/models/user-profile.model';
import { UserProfileService } from 'src/app/services/user-profile.service';

@Component({
    selector: 'app-user-manager',
    templateUrl: './user-manager.component.html',
    styleUrls: ['./user-manager.component.scss']
})
export class UserManagerComponent implements OnInit {
    @Input()
    get userId(): string{return this._userId;}
    set userId(userId: string){this.setUserId(userId);} 
    private _userId: string;

    profile: UserProfile;

    //c96f291e-8e18-45e9-afbf-5d8de7d0ef60 Assessment Manager
    //33f0b7b7-c796-4bcc-86fc-ac01d3cfec48 Certification Manager
    //9870272c-e4aa-4492-abe2-0de301f5cc8b My Certifications
    //9104af7f-fc56-41f9-bedf-22e4469ae30b My CEUS
    //a4fdaccf-768e-4bbe-93e8-44ba1d367195 My Surveys
    //eb96fb26-88fb-4c3b-8ca6-ef13f609f770 Schedule Manager
    //03172482-a496-4e6e-8c85-2b4143100a4e Survey Manager
    readonly container: Container = {
        branches: [
            {
                apps: ['personal-information', 'security-and-access', 'affiliations', 'role-mappings'],
                icon: 'account_box',
                iconType: AppIconType.ICON,
                title: "Account"
            },
            {
                apps: [],
                icon: 'warning',
                iconType: AppIconType.ICON,
                title: "Branch B"
            },
            {
                apps: [],
                icon: 'alarm_on',
                iconType: AppIconType.ICON,
                title: "Branch C"
            }
        ],
        root: null
    };

    constructor(private userProfileSvc: UserProfileService, private userSvc: UsersService) { }

    ngOnInit() { }

    private setUserId(userId: string){
        this._userId = userId;
        this.userSvc.fetchById(this.userId).subscribe((profile: UserProfileKeycloak) => {
            this.profile = {
                alternateEmails: ['test@alt.com', 'testagain@alt.com'],
                email: profile.email,
                firstName: profile.firstName,
                lastName: profile.lastName,
                organizationMemberships: [
                    {orgId: '', orgTitle: 'Ultimate Knowledge Institute', roleId: '', roleTitle: 'Senior UI Developer'},
                    {orgId: '', orgTitle: 'ManTech', roleId: '', roleTitle: 'Integration Specialist'}
                ],
                type: '',
                userId: profile.id,
                username: profile.username
            };
        });
    }
}
