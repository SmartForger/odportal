import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RegistrationService } from 'src/app/services/registration.service';
import { ApplicantColumn, ApplicantColumnGroup, ApplicantBindingType } from 'src/app/models/applicant-columns.model';
import { RegistrationSummaryFields, Registration } from 'src/app/models/registration.model';

@Component({
    selector: 'app-applicant-table-options-modal',
    templateUrl: './applicant-table-options-modal.component.html',
    styleUrls: ['./applicant-table-options-modal.component.scss']
})
export class ApplicantTableOptionsModalComponent implements OnInit {

    @Input('options') 
    get options(): Array<ApplicantColumn>{return this._options;}
    set options(options: Array<ApplicantColumn>){
        console.log(`setting options to ${options}`);
        this._options = options;
        this.generateFieldOptions();
    }
    private _options: Array<ApplicantColumn>;

    @Input('process') 
    get process(): Registration{return this._process;}
    set process(process: Registration) {
        if(process){
            this._process = process; 
            this.generateFieldOptions();
        }
    }
    private _process: Registration;

    @Output() newColumns: EventEmitter<Array<ApplicantColumn>>;

    hiddenUserFields: Array<ApplicantColumn>;
    hiddenBoundFields: Array<ApplicantColumn>;
    hiddenVerifierFields: Array<ApplicantColumn>;
    hiddenRegFields: Array<ApplicantColumn>;
    shownUserFields: Array<ApplicantColumn>;
    shownBoundFields: Array<ApplicantColumn>;
    shownVerifierFields: Array<ApplicantColumn>;
    shownRegFields: Array<ApplicantColumn>;

    constructor(private regSvc: RegistrationService) {
        this.newColumns = new EventEmitter<Array<ApplicantColumn>>();
        this._options = null;
        this._process = null;
        this.initializeFields();
    }

    ngOnInit() {
    }

    exportNewColumns(): void{
        this.newColumns.emit(this.shownUserFields.concat(this.shownBoundFields, this.shownVerifierFields, this.shownRegFields));
    }

    hide(group: ApplicantColumnGroup, field: ApplicantColumn){
        let arrs: [Array<ApplicantColumn>, Array<ApplicantColumn>] = this.selectArrays(group);
        this.shift(field, arrs[1], arrs[0]);    
    }

    show(group: ApplicantColumnGroup, field: ApplicantColumn){
        let arrs: [Array<ApplicantColumn>, Array<ApplicantColumn>] = this.selectArrays(group);
        this.shift(field, arrs[0], arrs[1]);
    }


    private generateFieldOptions(): void{
        if(!this.process || !this.options){return;}
        else if(this.process.docId !== 'all'){
            this.regSvc.summaryFields(this.process.docId).subscribe((fields: RegistrationSummaryFields) => {
                this.initializeFields();
                this.hiddenBoundFields = fields.bindings;
                this.hiddenBoundFields.sort((a: ApplicantColumn, b: ApplicantColumn) => {
                    if(a.title < b.title){return -1;}
                    else if(a.title > b.title){return 1;}
                    else{return 0;}
                });
                this.hiddenVerifierFields = fields.verifiers;
                this.hiddenVerifierFields.sort((a: ApplicantColumn, b: ApplicantColumn) => {
                    if(a.title < b.title){return -1;}
                    else if(a.title > b.title){return 1;}
                    else{return 0;}
                });
                this.options.forEach((col: ApplicantColumn) => {
                    this.show(col.columnGroup, col);
                });
            });
        }
        else{
            this.initializeFields();
            this.options.forEach((col: ApplicantColumn) => {
                this.show(col.columnGroup, col);
            });
        }
    }

    private initializeFields(): void{
        this.hiddenUserFields = [
            {binding: 'email', bindingType: ApplicantBindingType.TEXT, columnGroup: ApplicantColumnGroup.USER, title: 'Email'},
            {binding: 'emailVerified', bindingType: ApplicantBindingType.TEXT, columnGroup: ApplicantColumnGroup.USER, title: 'Email Verified'},
            {binding: 'firstName', bindingType: ApplicantBindingType.TEXT, columnGroup: ApplicantColumnGroup.USER, title: 'First Name'},
            {binding: 'fullName', bindingType: ApplicantBindingType.TEXT, columnGroup: ApplicantColumnGroup.USER, title: 'Full Name'},
            {binding: 'lastName', bindingType: ApplicantBindingType.TEXT, columnGroup: ApplicantColumnGroup.USER, title: 'Last Name'},
            {binding: 'online', bindingType: ApplicantBindingType.ICON, columnGroup: ApplicantColumnGroup.USER, title: 'Online'},
            {binding: 'username', bindingType: ApplicantBindingType.TEXT, columnGroup: ApplicantColumnGroup.USER, title: 'Username'}
        ];
        this.hiddenBoundFields = [ ];
        this.hiddenVerifierFields = [ ];
        this.hiddenRegFields = [
            {binding: 'title', bindingType: ApplicantBindingType.TEXT, columnGroup: ApplicantColumnGroup.PROCESS, title: 'Title'},
            {binding: 'progress', bindingType: ApplicantBindingType.PROGRESS, columnGroup: ApplicantColumnGroup.PROCESS, title: 'Progress'},
            {binding: 'status', bindingType: ApplicantBindingType.ENUM, columnGroup: ApplicantColumnGroup.PROCESS, title: 'Status'}
        ];

        this.shownUserFields = [ ];
        this.shownBoundFields = [ ];
        this.shownVerifierFields = [ ];
        this.shownRegFields = [ ];
    }

    selectArrays(group: ApplicantColumnGroup): [Array<ApplicantColumn>, Array<ApplicantColumn>]{
        let hiddenFields: Array<ApplicantColumn>;
        let shownFields: Array<ApplicantColumn>;
        switch(group){
            case ApplicantColumnGroup.BINDING:
                hiddenFields = this.hiddenBoundFields;
                shownFields = this.shownBoundFields;
                break;
            case ApplicantColumnGroup.PROCESS:
                hiddenFields = this.hiddenRegFields;
                shownFields = this.shownRegFields;
                break;
            case ApplicantColumnGroup.USER:
                hiddenFields = this.hiddenUserFields;
                shownFields = this.shownUserFields;
                break;
            case ApplicantColumnGroup.VERIFICATION:
                hiddenFields = this.hiddenVerifierFields;
                shownFields = this.shownVerifierFields;
                break;
            default:
                hiddenFields = [ ];
                shownFields = [ ];
        }
        return [hiddenFields, shownFields];
    }

    private shift(field: ApplicantColumn, from: Array<ApplicantColumn>, to: Array<ApplicantColumn>): void{
        let spliceIndex = from.findIndex((fromField: ApplicantColumn) => {
            return field.binding === fromField.binding && field.columnGroup === fromField.columnGroup;
        });
        if(spliceIndex !== -1){
            from.splice(spliceIndex, 1);
            let insertIndex = 0;
            let found = false;
            while(insertIndex < to.length && !found){
                if(to[insertIndex].title > field.title){
                    found = true;
                }
                else{
                    insertIndex++;
                }
            }
            if(!found){
                to.push(field);
            }
            else{
                to.splice(insertIndex, 0, field);
            }
        }
    }
}
