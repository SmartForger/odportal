import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { UserProfileService } from 'src/app/services/user-profile.service';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserProfileOD360, UserProfile } from 'src/app/models/user-profile.model';

@Component({
    selector: 'app-edit-alt-emails',
    templateUrl: './edit-alt-emails.component.html',
    styleUrls: ['./edit-alt-emails.component.scss']
})
export class EditAltEmailsComponent implements OnInit {

    uniqueEmailValidator: AsyncValidatorFn = (control: AbstractControl): Observable<ValidationErrors | null> => {
        return new Observable((observer) => {
            this.userProfileSvc.isUniqueEmail(control.value).subscribe((unique: boolean) => {
                if(unique){observer.next(null);}
                else{observer.next({["Unique Email"]: "email not unique"});}
                observer.complete();
            });
        });
    };
    
    userProfile: UserProfileOD360;

    constructor(private dialog: MatDialog, private userProfileSvc: UserProfileService){
        console.log(this.userProfileSvc);
    }

    ngOnInit() {
        this.userProfileSvc.getProfile().subscribe((profile) => {console.log('profile', profile); this.userProfile = profile});
    }

    add(): void {
        let mdr: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {data: {
            type: PlatformModalType.SECONDARY,
            title: "Add Alternate Email",
            submitButtonTitle: "Add",
            formFields: [{
                type: 'text-input',
                label: 'Email',
                defaultValue: '',
                fullWidth: true,
                name: 'email',
                validators: [function(email: RegExp){
                    return this.uniqueEmailValidator;
                }.bind(this)]
            }]
        }});

        mdr.afterClosed().subscribe((data) => {
            if(data){
                this.userProfileSvc.addAltEmail(data.email).subscribe((profile: UserProfileOD360) => {
                    this.userProfile = profile;
                });
            }
        });
    }

    remove(index: number): void{
        this.userProfileSvc.removeAltEmail(this.userProfile.alternateEmails[index]).subscribe((profile: UserProfileOD360) => {
            this.userProfile = profile;
        });
    }
}
