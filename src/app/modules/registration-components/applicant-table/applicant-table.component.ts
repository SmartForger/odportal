import { Component, Output, EventEmitter, ViewChild, Input, OnInit, QueryList, ElementRef, ViewChildren } from '@angular/core';
import { UserProfileWithRegistration } from 'src/app/models/user-profile-with-registration.model';
import { MatTable, MatDialog, MatDialogRef, MatSelectChange } from '@angular/material';
import { UserRegistrationSummary } from 'src/app/models/user-registration-summary.model';
import { ApplicantColumn, ApplicantColumnGroup, ApplicantBindingType } from 'src/app/models/applicant-columns.model';
import { ApplicantTableOptionsModalComponent } from '../applicant-table-options-modal/applicant-table-options-modal.component';
import { Registration } from 'src/app/models/registration.model';
import { RegistrationService } from 'src/app/services/registration.service';

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
    processId: string;
    registrationColumnCount: number;
    registrationProcesses: Array<Registration>;
    rows: Array<Object>;
    userColumnCount: number;
    verificationColumnCount: number;
    private sortCol: string;
    private sortKey: string;
    private sortAsc: boolean;
    @ViewChild(MatTable) private table: MatTable<UserProfileWithRegistration>;
    @ViewChildren('subheader', {read: ElementRef}) private subheaders: QueryList<ElementRef>;

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

    constructor(private dialog: MatDialog, private regSvc: RegistrationService) {
        this._columns = new Array<ApplicantColumn>();
        this.columnsDef = new Array<string>();
        this.headerColumnsDef = new Array<string>();
        this.processId = '';
        this.registrationColumnCount = 0;
        this.registrationProcesses = new Array<Registration>();
        this.rows = new Array<Object>();
        this.userColumnCount = 0;
        this.verificationColumnCount = 0;

        this.regSvc.listProcesses().subscribe((processes: Array<Registration>) => {
            this.registrationProcesses = processes;
        });

        this.hardcode();
    }

    ngOnInit() {
        this.init = true;
    }

    applyFilter(event: KeyboardEvent): void{

    }

    getColDef(col: ApplicantColumn): string{
        return `${col.binding}-header`
    }

    getSubcolDef(col: ApplicantColumn, key: string): string{
        return `${col.binding}-${key}`;
    }

    listSubheaders(col: ApplicantColumn): Array<string>{
        return Object.keys(this.rows[0][col.binding]);
    }

    onProcessChange(event: MatSelectChange){
        this.processId = event.value;
    }

    openOptions(): void{
        let dialogRef = this.dialog.open(ApplicantTableOptionsModalComponent, {

        });
        dialogRef.componentInstance.options = this.columns;
        dialogRef.componentInstance.process = this.registrationProcesses.find((reg: Registration) => {return reg.docId === this.processId;});
        dialogRef.componentInstance.newColumns.subscribe((cols: Array<ApplicantColumn>) => {
            this.columns = cols;
            dialogRef.close();
        });
    }

    parseStatus(status: string): string {
        switch (status) {
            case 'incomplete': return 'Incomplete';
            case 'inprogress': return 'In Progress';
            case 'complete': return 'Complete';
        }
    }

    round(num: number): number{
        return Math.round(num);
    }

    showAscArrow(binding: string, key?: string): boolean{
        return this.sortAsc && this.showArrow(binding, key);
    }

    showDescArrow(binding: string, key?: string): boolean{
        return !this.sortAsc && this.showArrow(binding, key);
    }

    sort(column: ApplicantColumn, key?: string): void{
        console.log(column);
        if(column.binding !== this.sortCol || (key !== undefined && key !== this.sortKey)){
            let sortFunc: (a: Object, b: Object) => number;
            switch(column.bindingType){
                case ApplicantBindingType.BOOLEAN:
                    sortFunc = (a: Object, b: Object) => {
                        if(a[column.binding] === null){console.log(`a is null, b is null? ${b[column.binding] === null}`); return b[column.binding] === null ? 0 : 1;}
                        else if(b[column.binding] === null){console.log(`b is null`); return -1;}
                        else{return a[column.binding] && !b[column.binding] ? -1 : !a[column.binding] && b[column.binding] ? 1 : 0;}
                    };
                    break;
                case ApplicantBindingType.ENUM:
                case ApplicantBindingType.ICON:
                case ApplicantBindingType.PROGRESS:
                case ApplicantBindingType.TEXT:
                    sortFunc = (a: Object, b: Object) => {return a[column.binding] > b[column.binding] ? 1 : a[column.binding] < b[column.binding] ? -1 : 0;};
                    break;
                case ApplicantBindingType.LIST:
                    sortFunc = (a: Object, b: Object) => {
                        if(a[column.binding][key] && !b[column.binding][key]){console.log('1'); return -1;}
                        else if(!a[column.binding][key] && b[column.binding][key]){console.log('-1'); return 1;}
                        else{
                            Object.keys(a[column.binding]).forEach((otherKey: string) => {
                                if(otherKey !== key){
                                    if(a[column.binding][otherKey] && !b[column.binding][otherKey]){return -1;}
                                    else if(!a[column.binding][otherKey] && b[column.binding][otherKey]){return 1;}
                                }
                            });
                            return 0;
                        }
                    };
                    this.sortKey = key;
                    break;
                case ApplicantBindingType.RADIO:
                    break;
            }
            this.rows.sort(sortFunc);
            this.sortCol = column.binding;
            this.sortAsc = true;
        }
        else{
            this.rows.reverse();
            this.sortAsc = !this.sortAsc;
        }
        this.table.renderRows();
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

    private showArrow(binding: string, key?: string): boolean{
        if(this.sortCol === binding && (key === undefined || key === this.sortKey)){
            let headerEl = this.subheaders.find((el: ElementRef) => {return el.nativeElement.id === `subheader-${binding}`});
            if(headerEl !== undefined){
                return headerEl.nativeElement.clientWidth >= 75;
            }
        }
        return false;
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
                values: ['person', 'person', 'person']
            },
            {
                columnGroup: ApplicantColumnGroup.USER,
                binding: 'username',
                bindingType: ApplicantBindingType.TEXT,
                title: 'Username',
                values: ['someguy', 'randomadmin', 'anotherone']
            },
            {   
                columnGroup: ApplicantColumnGroup.USER,
                binding: 'fullName',
                bindingType: ApplicantBindingType.TEXT,
                title: 'Full Name',
                values: ['Some Guy', 'Random Admin', "Another One"]
            },
            {
                columnGroup: ApplicantColumnGroup.BINDING,
                binding: 'securityLevels',
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
                    },
                    {
                        "Unclassified": false,
                        "Secret": false,
                        "Top Secret": true,
                        "Other": true
                    }
                ]
            },
            {
                columnGroup: ApplicantColumnGroup.BINDING,
                binding: 'permissionsRequested',
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
                    },
                    {
                        "Org Member": false,
                        "Contractor": true,
                        "Training Manager": true,
                        "Org Admin": false
                    }
                ]
            },
            {
                columnGroup: ApplicantColumnGroup.VERIFICATION,
                binding: 'Information Owner Approval',
                bindingType: ApplicantBindingType.BOOLEAN,
                title: 'IO',
                alt: 'Information Owner Approval',
                values: [true, true, null]
            },
            {
                columnGroup: ApplicantColumnGroup.VERIFICATION,
                binding: 'IAO Approval',
                bindingType: ApplicantBindingType.BOOLEAN,
                title: 'IAO',
                alt: 'Information Assurance Officer Approval',
                values: [false, true, null]
            },
            {
                columnGroup: ApplicantColumnGroup.VERIFICATION,
                binding: 'Supervisor Approval',
                bindingType: ApplicantBindingType.BOOLEAN,
                title: 'Sup',
                alt: 'Supervisor Approval',
                values: [true, false, null]
            },
            {
                columnGroup: ApplicantColumnGroup.VERIFICATION,
                binding: 'Security Manager Approval',
                bindingType: ApplicantBindingType.BOOLEAN,
                title: 'Sec',
                alt: 'Security Manager Approval',
                values: [null, false, false]
            },
            {
                columnGroup: ApplicantColumnGroup.PROCESS,
                binding: 'progress',
                bindingType: ApplicantBindingType.PROGRESS,
                title: 'Progress',
                values: [25, 75, 50]
            },
            {
                columnGroup: ApplicantColumnGroup.PROCESS,
                binding: 'status',
                bindingType: ApplicantBindingType.ENUM,
                title: 'Status',
                values: ['Incomplete', 'Complete', 'Incomplete']
            }
        ];
    }
}