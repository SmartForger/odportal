import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { RegistrationService } from 'src/app/services/registration.service';
import { ApplicantColumn, ApplicantColumnGroup, ApplicantBindingType } from 'src/app/models/applicant-table.models';
import { RegistrationSummaryFields, Registration } from 'src/app/models/registration.model';
import { Cloner } from '../../../util/cloner';
import { MatDialogRef } from '@angular/material';
import { PlatformModalType } from 'src/app/models/platform-modal.model';

@Component({
    selector: 'app-applicant-table-options-modal',
    templateUrl: './applicant-table-options-modal.component.html',
    styleUrls: ['./applicant-table-options-modal.component.scss']
})
export class ApplicantTableOptionsModalComponent implements OnInit, OnDestroy {

    @Input('options') 
    get options(): Array<ApplicantColumn>{return this._options;}
    set options(options: Array<ApplicantColumn>){
        this._options = Cloner.cloneObjectArray(options);
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
    // hiddenBoundFields: Array<ApplicantColumn>;
    hiddenApplicantResponseFields: Array<ApplicantColumn>;
    hiddenApproverResponseFields: Array<ApplicantColumn>;
    hiddenVerifierFields: Array<ApplicantColumn>;
    hiddenRegFields: Array<ApplicantColumn>;
    shownApplicantResponseFields: Array<ApplicantColumn>; 
    shownApproverResponseFields: Array<ApplicantColumn>;
    shownUserFields: Array<ApplicantColumn>;
    // shownBoundFields: Array<ApplicantColumn>;
    shownVerifierFields: Array<ApplicantColumn>;
    shownRegFields: Array<ApplicantColumn>;

    constructor(
        private regSvc: RegistrationService,
        private dlgRef: MatDialogRef<ApplicantTableOptionsModalComponent>
    ) {
        this.newColumns = new EventEmitter<Array<ApplicantColumn>>();
        this._options = null;
        this._process = null;
        this.initializeFields();

        this.dlgRef.addPanelClass("platform-modal");
        this.dlgRef.addPanelClass(PlatformModalType.PRIMARY);
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.options.forEach((option: ApplicantColumn) => {
            if(option.hasOwnProperty('isEdit')){
                option['isEdit'] = false;
            }
        })
    }

    editFieldName(field: ApplicantColumn): void{
        field['isEdit'] = true;
    }

    endEdit(event: KeyboardEvent, field: ApplicantColumn): void{
        if(event.code === 'Enter'){
            field['isEdit'] = false;
        }
    }

    exportNewColumns(): void{
        this.newColumns.emit(this.shownUserFields.concat(
            this.shownApplicantResponseFields,
            this.shownApproverResponseFields,
            this.shownVerifierFields,
            this.shownRegFields
        ));
    }

    hide(group: ApplicantColumnGroup, field: ApplicantColumn){
        let arrs: [Array<ApplicantColumn>, Array<ApplicantColumn>] = this.selectArrays(group);
        this.shift(field, arrs[1], arrs[0]);    
    }
    selectArrays(group: ApplicantColumnGroup): [Array<ApplicantColumn>, Array<ApplicantColumn>]{
        let hiddenFields: Array<ApplicantColumn>;
        let shownFields: Array<ApplicantColumn>;
        switch(group){
            case ApplicantColumnGroup.APPLICANT_RESPONSE:
                hiddenFields = this.hiddenApplicantResponseFields;
                shownFields = this.shownApplicantResponseFields;
                break;
            case ApplicantColumnGroup.APPROVER_RESPONSE:
                hiddenFields = this.hiddenApproverResponseFields;
                shownFields = this.shownApproverResponseFields;
                break;
            case ApplicantColumnGroup.REGISTRATION_DETAIL:
                hiddenFields = this.hiddenRegFields;
                shownFields = this.shownRegFields;
                break;
            case ApplicantColumnGroup.USER_PROFILE:
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

    show(group: ApplicantColumnGroup, field: ApplicantColumn){
        let arrs: [Array<ApplicantColumn>, Array<ApplicantColumn>] = this.selectArrays(group);
        this.shift(field, arrs[0], arrs[1]);
    }

    private generateFieldOptions(): void{
        if(!this.process || !this.options){return;}
        else if(this.process.docId !== 'all'){
            this.regSvc.summaryFields(this.process.docId).subscribe((fields: RegistrationSummaryFields) => {
                this.initializeFields();
                this.hiddenApplicantResponseFields = fields.applicantResponses;
                this.hiddenApplicantResponseFields.sort((a: ApplicantColumn, b: ApplicantColumn) => {
                    if(a.title < b.title){return -1;}
                    else if(a.title > b.title){return 1;}
                    else{return 0;}
                });
                this.hiddenApproverResponseFields = fields.approverResponses;
                this.hiddenApproverResponseFields.sort((a: ApplicantColumn, b: ApplicantColumn) => {
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
        this.hiddenApplicantResponseFields = [ ];
        this.hiddenApproverResponseFields = [ ];
        this.hiddenUserFields = [
            {binding: 'email', bindingType: ApplicantBindingType.TEXT, columnGroup: ApplicantColumnGroup.USER_PROFILE, title: 'Email'},
            {binding: 'emailVerified', bindingType: ApplicantBindingType.TEXT, columnGroup: ApplicantColumnGroup.USER_PROFILE, title: 'Email Verified'},
            {binding: 'firstName', bindingType: ApplicantBindingType.TEXT, columnGroup: ApplicantColumnGroup.USER_PROFILE, title: 'First Name'},
            {binding: 'fullName', bindingType: ApplicantBindingType.TEXT, columnGroup: ApplicantColumnGroup.USER_PROFILE, title: 'Full Name'},
            {binding: 'lastName', bindingType: ApplicantBindingType.TEXT, columnGroup: ApplicantColumnGroup.USER_PROFILE, title: 'Last Name'},
            {binding: 'online', bindingType: ApplicantBindingType.ICON, columnGroup: ApplicantColumnGroup.USER_PROFILE, title: 'Online'},
            {binding: 'username', bindingType: ApplicantBindingType.TEXT, columnGroup: ApplicantColumnGroup.USER_PROFILE, title: 'Username'}
        ];
        this.hiddenVerifierFields = [ ];
        this.hiddenRegFields = [
            {attributes: {enumerations: {'Approved': 'approved', 'Pending': 'pending'}}, binding: 'approvalStatus', bindingType: ApplicantBindingType.ENUM, columnGroup: ApplicantColumnGroup.REGISTRATION_DETAIL, title: 'Approved'},
            {binding: 'createdAt', bindingType: ApplicantBindingType.DATE, columnGroup: ApplicantColumnGroup.REGISTRATION_DETAIL, title: 'Date Created'},
            {binding: 'dateSubmitted', bindingType: ApplicantBindingType.DATE, columnGroup: ApplicantColumnGroup.REGISTRATION_DETAIL, title: 'Date Submitted'},
            {binding: 'dateCompleted', bindingType: ApplicantBindingType.DATE, columnGroup: ApplicantColumnGroup.REGISTRATION_DETAIL, title: 'Date Completed'},
            {binding: 'title', bindingType: ApplicantBindingType.TEXT, columnGroup: ApplicantColumnGroup.REGISTRATION_DETAIL, title: 'Title'},
            {binding: 'progress', bindingType: ApplicantBindingType.PROGRESS, columnGroup: ApplicantColumnGroup.REGISTRATION_DETAIL, title: 'Progress'},
            {attributes: {enumerations: {'Incomplete': 'incomplete', 'Inprogress': 'inprogress', 'Submitted': 'submitted', 'Complete': 'complete'}}, binding: 'status', bindingType: ApplicantBindingType.ENUM, columnGroup: ApplicantColumnGroup.REGISTRATION_DETAIL, title: 'Status'}
        ];

        this.shownUserFields = [ ];
        this.shownApplicantResponseFields = [ ];
        this.shownApproverResponseFields = [ ];
        this.shownVerifierFields = [ ];
        this.shownRegFields = [ ];
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
