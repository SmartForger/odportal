import { Component, OnInit, Input } from '@angular/core';
import { DynamicallyRenderable } from 'src/app/interfaces/dynamically-renderable';
import { UserProfile, UserProfileKeycloak } from 'src/app/models/user-profile.model';
import { UsersService } from 'src/app/services/users.service';
import { Cloner } from '../../../util/cloner';
import { UserProfileService } from 'src/app/services/user-profile.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';

@Component({
    selector: 'app-personal-information',
    templateUrl: './personal-information.component.html',
    styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements DynamicallyRenderable, OnInit {

    nativeProfile: UserProfile;
    profile: UserProfileKeycloak;
    profileShared: UserProfileKeycloak;

    readonly AVATAR_STYLE = {
        fontSize: '14px',
        fontWeight: 'bold',
        height: '35px',
        lineHeight: '37px',
        width: '35px'
    };

    constructor(
        private dialog: MatDialog,
        private userSvc: UsersService,
        private userProfileSvc: UserProfileService
    ) { }

    ngOnInit() { }

    addAltEmail(): void {
        let mdr: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {data: {
            type: PlatformModalType.SECONDARY,
            title: "Add Alternate Email",
            submitButtonTitle: "Add",
            formFields: [{
                type: 'text-input',
                label: 'Email',
                defaultValue: '',
                fullWidth: true,
                name: 'email'
            }]
        }});

        mdr.afterClosed().subscribe((data) => {
            if(data){
                this.userProfileSvc.isUniqueEmail(data.email).subscribe((unique: boolean) => {
                    if(unique){
                        this.userProfileSvc.addAltEmail(data.email, this.profile.id).subscribe((profile: UserProfile) => {
                            this.nativeProfile = profile;
                        });
                    }
                    else{
                        mdr = this.dialog.open(PlatformModalComponent, {data: {
                            type: PlatformModalType.SECONDARY,
                            title: "Email Already Taken",
                            subtitle: 'This email is already associated with a user account. If you need help recovering the account, or if you believe this message is in error, please contact a system administrator.',
                            submitButtonTitle: "Confirm",
                            formFields: [{
                                type: 'static',
                                label: 'Email',
                                defaultValue: data.email,
                                fullWidth: true
                            }]
                        }});
                    }
                });
            }
        });
    }

    cancel(): void{
        this.profile = Cloner.cloneObject(this.profileShared);
    }

    removeAltEmail(index: number): void{
        this.userProfileSvc.removeAltEmail(this.nativeProfile.alternateEmails[index], this.profile.id).subscribe((profile: UserProfile) => {
            this.nativeProfile = profile;
        });
    }

    setState(state: any): void {
        // if(!state.address){
        //     state.address = { };
        // }

        this.profileShared = state;
        this.profile = Cloner.cloneObject(state);

        this.userProfileSvc.getProfile(this.profile.id).subscribe((nativeProfile: UserProfile) => {
            this.nativeProfile = nativeProfile;
        });
    }

    update(): void{
        this.userSvc.updateProfile(this.profile).subscribe();
        this.profileShared.email = this.profile.email;
        this.profileShared.firstName = this.profile.firstName;
        this.profileShared.lastName = this.profile.lastName;
        this.profileShared.username = this.profile.username;
    }
}
