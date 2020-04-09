import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { UserProfileService } from 'src/app/services/user-profile.service';
import { UserProfileOD360 } from 'src/app/models/user-profile.model';


@Component({
    selector: 'app-edit-alt-emails',
    templateUrl: './edit-alt-emails.component.html',
    styleUrls: ['./edit-alt-emails.component.scss']
})
export class EditAltEmailsComponent implements OnInit {

    userProfile: UserProfileOD360;

    constructor(private dialog: MatDialog, private userProfileSvc: UserProfileService){ }

    ngOnInit() {
        this.userProfileSvc.getProfile().subscribe((profile) => { this.userProfile = profile });
    }

    add(): void {
        let mdr: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
            data: {
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
            }
        });

        mdr.afterClosed().subscribe((data) => {
            if (data) {
                this.userProfileSvc.isUniqueEmail(data.email).subscribe((unique: boolean) => {
                    if (unique) {
                        this.userProfileSvc.addAltEmail(data.email).subscribe((profile: UserProfileOD360) => {
                            this.userProfile = profile;
                        });
                    }
                    else {
                        mdr = this.dialog.open(PlatformModalComponent, {
                            data: {
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
                            }
                        });
                    }
                });
            }
        });
    }

    remove(index: number): void {
        this.userProfileSvc.removeAltEmail(this.userProfile.alternateEmails[index]).subscribe((profile: UserProfileOD360) => {
            this.userProfile = profile;
        });
    }
}
