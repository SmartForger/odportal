import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Approval, RegistrationSection, Form, ApproverContact, FormStatus, ApprovalStatus } from 'src/app/models/form.model';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { UserRegistrationService } from 'src/app/services/user-registration.service';
import { UserRegistration } from 'src/app/models/user-registration.model';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { PlatformFormField } from 'src/app/models/platform-form-field.model';
import * as moment from 'moment';

@Component({
    selector: 'app-approver-contacts',
    templateUrl: './approver-contacts.component.html',
    styleUrls: ['./approver-contacts.component.scss']
})
export class ApproverContactsComponent implements OnInit {

    @Input('data')
    get data(): Form {
        return this._data;
    }
    set data(data: Form) {
        this._data = data;
        this.approvalsWithTitles = new Array<{ section: string, approval: Approval }>();
        this.nudgeable = new Array<RegistrationSection>();
        if (this.data) {
            this.data.layout.sections.forEach((section: RegistrationSection) => {
                if (section.approval && section.approval.applicantDefined) {
                    this.buildApplicantDefinedApproval(section);
                    if(this.isNudgeable(section)){
                        this.nudgeable.push(section);
                    }
                }
            });
        }
    }
    private _data: Form;
    @Input() regId: string;
    @Input() userId: string;

    @Output() updatedContacts: EventEmitter<UserRegistration>;

    approvalsWithTitles: Array<{ section: string, approval: Approval }>;
    errors: boolean;
    form: FormGroup;
    nudgeable: Array<RegistrationSection>;

    constructor(
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
        private userRegSvc: UserRegistrationService
    ) {
        this.approvalsWithTitles = new Array<{ section: string, approval: Approval }>();
        this.errors = false;
        this.form = new FormGroup({});
        this.nudgeable = new Array<RegistrationSection>();
        this.updatedContacts = new EventEmitter<UserRegistration>();
    }

    ngOnInit() { }
    
    generateControlName(sectionTitle: string): string {
        return sectionTitle.replace(/\s/g, '').toLowerCase();
    }

    getApproverContacts(): Array<ApproverContact> {
        let contact = new Array<ApproverContact>();
        this.approvalsWithTitles.forEach((awt: { section: string, approval: Approval }) => {
            contact.push({ section: awt.section, email: this.form.controls[this.generateControlName(awt.section)].value });
        });
        return contact;
    }

    onNudge(): void{
        let fields = new Array<PlatformFormField>();
        this.nudgeable.forEach((section: RegistrationSection) => {
            fields.push(
                {
                    defaultValue: section.approval.email,
                    fullWidth: true,
                    label: section.approval.title,
                    type: "static"
                },
                {
                    defaultValue: section.approval.lastContacted ? moment(section.approval.lastContacted).format('YYYY/MM/DD') : 'Unknown',
                    fullWidth: true,
                    label: "Last Contacted (YYYY/MM/DD)",
                    type: "static"
                }
            );
        });

        let modalRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {data: {
            type: PlatformModalType.SECONDARY,
            title: "Nudge Approvers",
            subtitle: "We will nudge the following approvers using their listed contact information. If you do not see an approver listed below, it is because they were recently contacted. Please allow approvers at least 24 hours to respond to your application.",
            submitButtonTitle: "Confirm",
            submitButtonClass: "",
            formFields: fields
        }});

        modalRef.afterClosed().subscribe((data) => {
            if(data){
                this.nudgeable.forEach((section: RegistrationSection) => {
                    this.userRegSvc.nudgeApprover(this.userId, this.regId, this.data.docId, this.nudgeable).subscribe((regDoc: UserRegistration) => {
                        this.updatedContacts.emit(regDoc);
                    });
                });
            }
        });
    }

    onRevoke(): void {
        let fields = new Array<PlatformFormField>();
        this.approvalsWithTitles.forEach((awt: {section: string, approval: Approval}) => {
            if(awt.approval.applicantDefined){
                fields.push({
                    defaultValue: awt.approval.email,
                    fullWidth: true,
                    label: awt.approval.title,
                    type: "static"
                });
            }
        });

        let modalRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {data: {
            type: PlatformModalType.SECONDARY,
            title: "Edit Approver Contact Information",
            subtitle: "Are you sure you want to change your approver contact information? Any accounts tied to the old information will not be able to approve your form unless you rename them, and any existing data from these approvers will be permanently lost.",
            submitButtonTitle: "Confirm",
            submitButtonClass: "bg-yellow",
            formFields: fields
        }});
        
        modalRef.afterClosed().subscribe((data) => {
            if(data){
                this.userRegSvc.unsubmitApproverContacts(this.userId, this.regId, this.data.docId).subscribe((regDoc: UserRegistration) => {
                    this.updatedContacts.emit(regDoc);
                });
            }
        });
    }

    onSubmit(): void {
        this.userRegSvc.submitApproverContacts(this.userId, this.regId, this.data.docId, this.getApproverContacts()).subscribe((regDoc: UserRegistration) => {
            this.updatedContacts.emit(regDoc);
        });
    }

    refreshFormValues(): void{
        this.approvalsWithTitles.forEach((awt: {section: string, approval: Approval}) => {
            let controlName = this.generateControlName(awt.section);
            this.form.controls[controlName].setValue(awt.approval.email ? awt.approval.email : '');
            if(this.form.controls[controlName].enabled && awt.approval.status !== 'missing'){
                this.form.controls[controlName].disable();
            }
            else if(this.form.controls[controlName].disabled && awt.approval.status === 'missing'){
                this.form.controls[controlName].enable();
            }
        });
    }

    validate(): boolean {
        this.errors = false;
        this.approvalsWithTitles.forEach((awt: { section: string, approval: Approval }) => {
            let name = this.generateControlName(awt.section);
            if (!this.form.controls[name].valid) {
                this.errors = true;
                this.form.controls[name].markAsTouched();
            }
        });

        if (this.errors) {
            this.cdr.detectChanges();
        }

        return !this.errors;
    }

    private buildApplicantDefinedApproval(section: RegistrationSection): void {
        this.approvalsWithTitles.push({ section: section.title, approval: section.approval });
        let validators = new Array<ValidatorFn>();
        validators.push(Validators.required);
        if (section.approval.regex) {
            validators.push(Validators.pattern(decodeURIComponent(section.approval.regex)));
        };
        this.form.addControl(
            this.generateControlName(section.title),
            new FormControl(
                {
                    value: (section.approval.email ? section.approval.email : ''),
                    disabled: section.approval.status !== 'missing'
                },
                validators
            )
        );
    }

    private isNudgeable(section: RegistrationSection): boolean{
        if(section.approval.status !== 'incomplete' || this.data.status !== 'submitted'){return false;}
        return (section.approval.hasOwnProperty('lastContacted') ? moment(new Date()).subtract(1, 'day') > moment(section.approval.lastContacted) : true);    
    }
}
