import { Component, Output, EventEmitter, ViewChild, Input, OnInit } from '@angular/core';
import { UserProfileWithRegistration } from 'src/app/models/user-profile-with-registration.model';
import { MatTable } from '@angular/material';
import { UserRegistrationSummary } from 'src/app/models/user-registration-summary.model';
import { ApplicantColumn, ApplicantColumnGroup, ApplicantBindingType } from 'src/app/models/applicant-columns.model';

@Component({
    selector: 'app-applicant-table',
    templateUrl: './applicant-table.component.html',
    styleUrls: ['./applicant-table.component.scss']
})
export class ApplicantTableComponent implements OnInit {
    init: boolean;
    columnsToDisplay: Array<string>;
    @Input('summaries')
    get summaries(): Array<any> { return this._summaries }
    set summaries(summaries: Array<any>) {
        //this._summaries = summaries;
        if (this.init) {
            // this.table.renderRows()
        }
    }
    private _summaries: Array<any>;
    @Input()
    get users(): Array<UserProfileWithRegistration> { return this._users; }
    set users(users: Array<UserProfileWithRegistration>) {
        this._users = users;
        if (this.init) {
            this.table.renderRows();
        }
        console.log(this._users);
    }
    private _users: Array<UserProfileWithRegistration>;
    @Output() userSelected: EventEmitter<UserProfileWithRegistration>;
    @ViewChild(MatTable) table: MatTable<UserProfileWithRegistration>;
    userColumnsToDisplay: Array<string>;
    columns: Array<ApplicantColumn>;

    constructor() {
        this.init = false;
        this.columns = new Array<ApplicantColumn>();
        this.columnsToDisplay = [
            'online',
            'username',
            'fullname',
            'Unclassified','Secret','Top Secret','Other',
            'Org Member','Contractor','Training Manager','Org Admin',
            'status'
        ];
        this.summaries = new Array<any>();
        this.users = new Array<UserProfileWithRegistration>();
        this.userColumnsToDisplay = [
            'online',
            'username',
            'fullname',
            'email',
            'action'
        ];
        this.userSelected = new EventEmitter<UserProfileWithRegistration>();

        this.hardcode();


    }

    ngOnInit() {
        this.init = true;
    }

    parseStatus(status: string): string {
        switch (status) {
            case 'incomplete': return 'Incomplete';
            case 'inprogress': return 'In Progress';
            case 'complete': return 'Complete';
        }
    }

    listSubheaders(col: ApplicantColumn): Array<string>{
        return Object.keys(this.summaries[0][col.binding]);
    }

    private hardcode() {

        this.columns = [
            {
                columnGroup: ApplicantColumnGroup.USER,
                binding: 'online',
                bindingType: ApplicantBindingType.TEXT,
                title: '',
            },
            {
                columnGroup: ApplicantColumnGroup.USER,
                binding: 'username',
                bindingType: ApplicantBindingType.TEXT,
                title: 'Username',
            },
            {   
                columnGroup: ApplicantColumnGroup.USER,
                binding: 'fullname',
                bindingType: ApplicantBindingType.TEXT,
                title: 'Full Name',
            },
            {
                columnGroup: ApplicantColumnGroup.BINDING,
                binding: 'securityClass',
                bindingType: ApplicantBindingType.LIST,
                title: 'Security Class',
            },
            {
                columnGroup: ApplicantColumnGroup.BINDING,
                binding: 'requestedRoles',
                bindingType: ApplicantBindingType.LIST,
                title: 'Requested Roles',
            },
            {
                columnGroup: ApplicantColumnGroup.VERIFICATION,
                binding: 'ioApproval',
                bindingType: ApplicantBindingType.BOOLEAN,
                title: 'Information Owner',
            },
            {
                columnGroup: ApplicantColumnGroup.VERIFICATION,
                binding: 'iaoApproval',
                bindingType: ApplicantBindingType.BOOLEAN,
                title: 'Information Assurance Owner'
            },
            {
                columnGroup: ApplicantColumnGroup.VERIFICATION,
                binding: 'supervisorApproval',
                bindingType: ApplicantBindingType.BOOLEAN,
                title: 'Supervisor'
            },
            {
                columnGroup: ApplicantColumnGroup.VERIFICATION,
                binding: 'securityManagerApproval',
                bindingType: ApplicantBindingType.BOOLEAN,
                title: 'Security Manager'
            },
            {
                columnGroup: ApplicantColumnGroup.PROCESS,
                binding: 'progress',
                bindingType: ApplicantBindingType.PROGRESS,
                title: 'Progress'
            },
            {
                columnGroup: ApplicantColumnGroup.PROCESS,
                binding: 'status',
                bindingType: ApplicantBindingType.ENUM,
                title: 'Status'
            }
        ];

        this._summaries = [
            {
                username: 'someguy',
                fullname: 'Some Guy',
                securityClass: {
                    "Unclassified": true,
                    "Secret": false,
                    "Top Secret": false,
                    "Other": false
                },
                requestedRoles: {
                    "Org Member": true,
                    "Contractor": false,
                    "Training Manager": false,
                    "Org Admin": false
                },
                verifications: {
                    ioApproval: true,
                    iaoApproval: false,
                    supervisorApproval: true,
                    securityManagerApproval: null
                },
                progress: 50,
                status: 0,
                online: 'person'
            },
            {
                username: 'randomadmin',
                fullname: 'Random Admin',
                securityClass: {
                    "Unclassified": true,
                    "Secret": true,
                    "Top Secret": true,
                    "Other": false
                },
                requestedRoles: {
                    "Org Member": true,
                    "Contractor": false,
                    "Training Manager": true,
                    "Org Admin": true
                },
                verifications: {
                    ioApproval: true,
                    iaoApproval: true,
                    supervisorApproval: false,
                    securityManagerApproval: false
                },
                progress: 50,
                status: 0,
                online: 'person'
            }
        ];
        
    }
}