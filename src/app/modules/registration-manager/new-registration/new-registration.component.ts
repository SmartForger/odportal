import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { KeyValue } from 'src/app/models/key-value.model';
import { RegistrationService } from 'src/app/services/registration.service';
import { Registration } from 'src/app/models/registration.model';
import { passwordRequirementsValidator } from '../../form-validators/custom-validators';
import { confirmationMatchValidator } from '../../form-validators/confirmation-match-validator';
import { RegistrationAccountService } from 'src/app/services/registration-account.service';
import { UserRepresentation } from 'src/app/models/user-representation.model';
import { CredentialsRepresentation } from 'src/app/models/credentials-representation.model';
import { NotificationService } from 'src/app/notifier/notification.service';
import { NotificationType } from 'src/app/notifier/notificiation.model';
import { MatDialog } from '@angular/material';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';

@Component({
    selector: 'app-new-registration',
    templateUrl: './new-registration.component.html',
    styleUrls: ['./new-registration.component.scss']
})
export class NewRegistrationComponent implements OnInit {

    confirmingPassword: boolean;
    form: FormGroup;
    maskPassword: boolean;
    maskPasswordConfirm: boolean;
    passwordMatch: boolean;
    processOptions: Array<KeyValue>;

    readonly PASSWORD_REQS = {
        minLength: 15,
        uppers: 2,
        lowers: 2,
        numbers: 2,
        specials: 2
    };

    constructor(
        private dialog: MatDialog,
        private notifySvc: NotificationService,
        private regAccountSvc: RegistrationAccountService, 
        private regSvc: RegistrationService
    ) {
        this.confirmingPassword = false;
        this.form = new FormGroup({
            firstName: new FormControl('', Validators.required),
            lastName: new FormControl('', Validators.required),
            email: new FormControl('', Validators.required),
            username: new FormControl('', Validators.required),
            password: new FormControl('', [Validators.required, passwordRequirementsValidator(this.PASSWORD_REQS)]),
            passwordConfirm: new FormControl(''),
            process: new FormControl('', Validators.required),
        });
        this.form.get('username').disable();
        this.form.get('passwordConfirm').setValidators([Validators.required, confirmationMatchValidator(this.form.get('password') as FormControl)]);
        this.maskPassword = true;
        this.maskPasswordConfirm = true;
        this.passwordMatch = true;
        this.processOptions = new Array<KeyValue>();
        this.regSvc.listProcesses().subscribe((procs: Array<Registration>) => {
            this.processOptions = new Array<KeyValue>();
            procs.forEach((proc: Registration) => {
                this.processOptions.push({
                    display: proc.title,
                    value: proc.docId
                });
            });
        });
    }

    ngOnInit() { }
    
    confirmPasswordMatch(): void{
        setTimeout(function(){
            this.passwordMatch = this.form.controls['password'].value === this.form.controls['passwordConfirm'].value;
        }.bind(this), 100);
    }

    generateUserName(): void {
        setTimeout(function(){
            const fname: string = this.form.controls['firstName'].value;
            const lname: string = this.form.controls['lastName'].value;
            let username: string = '';

            if (fname) {username = fname;}
            if (lname) {username += '.' + lname;}
            if (username) {
                this.regAccountSvc.checkUsername(username).subscribe(
                    result => {
                        this.form.controls['username'].setValue(
                            result['recommend'].toLowerCase()
                        );
                    },
                    (err: any) => {
                        console.log(err);
                    }
                );
            } else {
                this.form.controls['username'].setValue(username);
            }
        }.bind(this), 100);
    }

    onSubmit(event: Event): void{
        event.preventDefault();
        event.stopPropagation();

        let credsRep: CredentialsRepresentation = {
            temporary: false,
            type: 'password',
            value: this.form.get('password').value
        };

        let userRep: UserRepresentation = {
            email: this.form.get('email').value,
            enabled: true,
            firstName: this.form.get('firstName').value,
            lastName: this.form.get('lastName').value,
            username: this.form.get('username').value
        };

        this.regAccountSvc.createApplicantAccount(this.form.get('process').value, userRep, credsRep, [], true).subscribe(
            (user: UserRepresentation) => {
                this.showSuccessDialog(user.username);
            },
            (err: any) => {
                console.log(err);
                this.notifySvc.notify({
                    type: NotificationType.Error,
                    message: 'This email address is already registered',
                });
            }
        );
    }
    
    private showSuccessDialog(username: string): void {
        this.dialog.open(PlatformModalComponent, {
            data: {
                type: PlatformModalType.SECONDARY,
                title: "Account Created",
                subtitle: "User applicant account created successfully.",
                submitButtonTitle: "Confirm",
                formFields: [
                    {
                        defaultValue: "An email has been dispatched with the following credentials.",
                        fullWidth: true,
                        type: 'static'
                    },
                    {
                        defaultValue: this.form.get('email').value,
                        fullWidth: true,
                        label: 'Email',
                        type: 'static'
                    },
                    {
                        defaultValue: this.form.get('username').value,
                        label: 'Username',
                        type: 'static'
                    },
                    {
                        defaultValue: this.form.get('password').value,
                        label: 'Password',
                        type: 'static'
                    }
                ]
            }
        });
    }

    toggleMaskPassword(): void{
        this.maskPassword = !this.maskPassword;
    }

    toggleMaskPasswordConfirm(): void{
        this.maskPasswordConfirm = !this.maskPasswordConfirm;
    }
}
