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
    @Input('columns') 
    get columns(): Array<ApplicantColumn>{return this._columns;}
    set columns(columns: Array<ApplicantColumn>){
        this._columns = columns;
        this.parseColumns();
    }
    private _columns: Array<ApplicantColumn>;
    columnsDef: Array<string>;
    headerColumnsDef: Array<string>;
    registrationColumnCount: number;
    rows: Array<Object>;
    userColumnCount: number;
    verificationColumnCount: number;
    @ViewChild(MatTable) table: MatTable<UserProfileWithRegistration>;


    @Input('summaries')
    get summaries(): Array<any> { return this._summaries }
    set summaries(summaries: Array<any>) {
        // this._summaries = summaries;
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
    userColumnsToDisplay: Array<string>;
    init: boolean;

    constructor() {
        this._columns = new Array<ApplicantColumn>();
        this.columnsDef = new Array<string>();
        this.headerColumnsDef = new Array<string>();
        this.registrationColumnCount = 0;
        this.rows = new Array<Object>();
        this.userColumnCount = 0;
        this.verificationColumnCount = 0;

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
        return Object.keys(this.rows[0][col.binding]);
    }

    getColDef(col: ApplicantColumn): string{
        return `${col.binding}-header`
    }

    getSubcolDef(col: ApplicantColumn, key: string): string{
        return `${col.binding}-${key}`;
    }

    round(num: number): number{
        return Math.round(num);
    }

    private parseColumns(): void{
        if(!this.columns){return;}
        
        this.columnsDef = new Array<string>();
        this.headerColumnsDef = new Array<string>();
        this.registrationColumnCount = 0;
        this.rows = new Array<Object>();
        this.userColumnCount = 0;
        this.verificationColumnCount = 0;

        this.columns.forEach((column: ApplicantColumn) => {
            if(column.values){
                while(this.rows.length < column.values.length){
                    this.rows.push( { } );
                }
                column.values.forEach((value: any, index: number) => {
                    this.rows[index][column.binding] = value;
                });
            }

            switch(column.columnGroup){
                case ApplicantColumnGroup.BINDING: 
                    this.headerColumnsDef.push(this.getColDef(column));
                    this.listSubheaders(column).forEach((subCol: string) => {
                        this.columnsDef.push(this.getSubcolDef(column, subCol));
                    });
                    break;
                case ApplicantColumnGroup.PROCESS:
                    ++this.registrationColumnCount;
                    this.columnsDef.push(column.binding);
                    break;
                case ApplicantColumnGroup.USER:
                    ++this.userColumnCount;
                    this.columnsDef.push(column.binding);
                    break;
                case ApplicantColumnGroup.VERIFICATION:
                    ++this.verificationColumnCount;
                    this.columnsDef.push(column.binding);
                    break;
            }
        });
        if(this.userColumnCount > 0){this.headerColumnsDef = ['user-column-header'].concat(this.headerColumnsDef);}
        if(this.verificationColumnCount > 0){this.headerColumnsDef.push('verification-column-header');}
        if(this.registrationColumnCount > 0){this.headerColumnsDef.push('registration-column-header');}
        // if(this.init){this.table.renderRows();}
    }

    private hardcode() {

        this.summaries = new Array<any>();
        this.init = false; 
        /*
        this.headerColumnsDef = ['user-column-header', 'securityClass', 'requestedRoles'];
        this.columnsDef = [
            'online',
            'username',
            'fullname',
            'Unclassified','Secret','Top Secret','Other',
            'Org Member','Contractor','Training Manager','Org Admin',
        ];
        this.userColumnCount = 3;
        */
        this.users = new Array<UserProfileWithRegistration>();
        this.userColumnsToDisplay = [
            'online',
            'username',
            'fullname',
            'email',
            'action'
        ];
        this.userSelected = new EventEmitter<UserProfileWithRegistration>();


        this.columns = [
            {
                columnGroup: ApplicantColumnGroup.USER,
                binding: 'online',
                bindingType: ApplicantBindingType.ICON,
                title: '',
                values: ['person', 'person']
            },
            {
                columnGroup: ApplicantColumnGroup.USER,
                binding: 'username',
                bindingType: ApplicantBindingType.TEXT,
                title: 'Username',
                values: ['someguy', 'randomadmin']
            },
            {   
                columnGroup: ApplicantColumnGroup.USER,
                binding: 'fullname',
                bindingType: ApplicantBindingType.TEXT,
                title: 'Full Name',
                values: ['Some Guy', 'Random Admin']
            },
            {
                columnGroup: ApplicantColumnGroup.BINDING,
                binding: 'securityClass',
                bindingType: ApplicantBindingType.LIST,
                title: 'Security Class',
                values: [
                    {
                        "Unclassified": true,
                        "Secret": false,
                        "Top Secret": false,
                        "Other": false
                    },
                    {
                        "Unclassified": true,
                        "Secret": true,
                        "Top Secret": true,
                        "Other": false
                    }
                ]
            },
            {
                columnGroup: ApplicantColumnGroup.BINDING,
                binding: 'requestedRoles',
                bindingType: ApplicantBindingType.LIST,
                title: 'Requested Roles',
                values: [
                    {
                        "Org Member": true,
                        "Contractor": false,
                        "Training Manager": false,
                        "Org Admin": false
                    },
                    {
                        "Org Member": true,
                        "Contractor": false,
                        "Training Manager": true,
                        "Org Admin": true
                    }
                ]
            },
            {
                columnGroup: ApplicantColumnGroup.VERIFICATION,
                binding: 'ioApproval',
                bindingType: ApplicantBindingType.BOOLEAN,
                title: 'Information Owner',
                values: [true, true]
            },
            {
                columnGroup: ApplicantColumnGroup.VERIFICATION,
                binding: 'iaoApproval',
                bindingType: ApplicantBindingType.BOOLEAN,
                title: 'Information Assurance Owner',
                values: [false, true]
            },
            {
                columnGroup: ApplicantColumnGroup.VERIFICATION,
                binding: 'supervisorApproval',
                bindingType: ApplicantBindingType.BOOLEAN,
                title: 'Supervisor',
                values: [true, false]
            },
            {
                columnGroup: ApplicantColumnGroup.VERIFICATION,
                binding: 'securityManagerApproval',
                bindingType: ApplicantBindingType.BOOLEAN,
                title: 'Security Manager',
                values: [null, false]
            },
            {
                columnGroup: ApplicantColumnGroup.PROCESS,
                binding: 'progress',
                bindingType: ApplicantBindingType.PROGRESS,
                title: 'Progress',
                values: [25, 75]
            },
            {
                columnGroup: ApplicantColumnGroup.PROCESS,
                binding: 'status',
                bindingType: ApplicantBindingType.ENUM,
                title: 'Status',
                values: ['Incomplete', 'Complete']
            }
        ];
        /*
        this.rows = [
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
        */
    }
}