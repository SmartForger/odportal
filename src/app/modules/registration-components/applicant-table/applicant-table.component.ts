import { Component, Output, EventEmitter, ViewChild, Input, OnInit, QueryList, ElementRef, ViewChildren, OnDestroy, Renderer2, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { MatTable, MatDialog, MatSelectChange, PageEvent, MatSelect, MatSlideToggle, MatCheckbox, MatDialogRef, MatSelectionListChange, MatDatepickerInputEvent } from '@angular/material';
import { ApplicantColumn, ApplicantColumnGroup, ApplicantBindingType, ApplicantTableMemory, PagedApplicantColumnResult, ApplicantTableSettings, ApplicantTableFilter, ApplicantTableOptions } from 'src/app/models/applicant-table.models';
import { ApplicantTableOptionsModalComponent } from '../applicant-table-options-modal/applicant-table-options-modal.component';
import { Registration } from 'src/app/models/registration.model';
import { RegistrationService } from 'src/app/services/registration.service';
import { RegistrationManagerService } from 'src/app/services/registration-manager.service';
import { VerificationService } from 'src/app/services/verification.service';
import { FormGroup } from '@angular/forms';
import { Moment } from 'moment';
import { Cloner } from 'src/app/util/cloner';

@Component({
    selector: 'app-applicant-table',
    templateUrl: './applicant-table.component.html',
    styleUrls: ['./applicant-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicantTableComponent implements OnInit, OnDestroy {
    @Input() applicantTableService: RegistrationManagerService | VerificationService;
    @Input() verifierEmails: Array<string>;
    @Output() userSelected: EventEmitter<string>;
    activeFilter: ApplicantTableFilter;
    columns: Array<ApplicantColumn>;
    columnsDef: Array<string>;
    displayTable: boolean;
    filterChanged: boolean;
    filterCloseFunc: EventListenerOrEventListenerObject;
    filterLeft: string;
    filters: Array<ApplicantTableFilter>;
    filterTop: string;
    formGroup: FormGroup;
    headerColumnsDef: Array<string>;
    page: number;
    pagedRows: Array<Object>;
    pageSize: number;
    pageTotal: number;
    processId: string;
    processMap: Map<string, ApplicantTableMemory>;
    registrationColumnCount: number;
    registrationIds: Array<string>;
    registrationProcesses: Array<Registration>;
    rows: Array<Object>;
    showClosed: boolean;
    sliderOptions: any;
    sortAsc: boolean;
    sortCol: ApplicantColumn;
    sortKey: string;
    userColumnCount: number;
    verificationColumnCount: number;
    @ViewChild('closedRegCheckbox') private closedToggle: MatCheckbox;
    @ViewChild(MatSelect) private regSelect: MatSelect;
    @ViewChildren('subheader', {read: ElementRef}) private subheaders: QueryList<ElementRef>;
    @ViewChild(MatTable) private table: MatTable<any>;

    constructor(
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog, 
        private regSvc: RegistrationService
    ) {
        // this.cdr.detach();

        this.applicantTableService = null;
        this.columns = new Array<ApplicantColumn>();
        this.columnsDef = new Array<string>();
        this.displayTable = true;
        this.filters = new Array<ApplicantTableFilter>();
        this.headerColumnsDef = new Array<string>();
        this.pagedRows = new Array<Object>();
        this.page = 0;
        this.pageSize = 10;
        this.pageTotal = 0;
        this.processId = 'all';
        this.processMap = new Map<string, ApplicantTableMemory>();
        this.registrationColumnCount = 0;
        this.registrationIds = new Array<string>();
        this.registrationProcesses = new Array<Registration>();
        this.rows = new Array<Object>();
        this.showClosed = false;
        this.sliderOptions = {
            ceil: 100,
            floor: 0
        };
        this.sortAsc = true;
        this.sortCol = null;
        this.userColumnCount = 0;
        this.userSelected = new EventEmitter<string>();
        this.verificationColumnCount = 0;
        this.verifierEmails = null;

        this.regSvc.listProcesses().subscribe((processes: Array<Registration>) => {
            this.registrationProcesses = processes;
        });
        // this.hardcode();
    }

    ngOnInit() { 
        this.setProcess('all');

        this.applicantTableService.loadTableSettings().subscribe((settings: ApplicantTableSettings) => {
            if(settings){
                let change = false;
                if(this.showClosed !== settings.showClosed){
                    this.closedToggle.toggle();
                    this.showClosed = !this.showClosed;
                    change = true;
                }
                if(this.processId !== settings.regId){
                    this.regSelect.value = settings.regId;
                    change = true;
                }
                if(change){
                    this.setProcess(settings.regId);
                }
            }
        });

        this.cdr.detectChanges();
    }

    ngOnDestroy() {
        this.applicantTableService.saveTableSettings({
            showClosed: this.showClosed,
            regId: this.processId
        }).subscribe();
        window.removeEventListener('click', this.filterCloseFunc);
    }

    applyFilter(event: KeyboardEvent): void{

    }

    enumClass(value: any): string{
        let color = '';
        switch(value){
            case 'approved':
            case 'complete': color = 'green green-bg'; break;
            case 'submitted': color = 'yellow yellow-bg'; break;
        }

        return `faux-chip ${color}`;
    }

    enumText(value: any): string{
        if(!value){
            return '';
        }
        else if(typeof value === 'string'){
            let firstChar = (value as string).charAt(0).toUpperCase();
            let restOfStr = (value as string).length > 1 ? (value as string).substr(1).toLowerCase() : '';
            return `${firstChar}${restOfStr}`
        }
    }

    filterEnumIsSelected(en: string): void{
        return this.activeFilter.value[this.activeFilter.column.attributes.enumerations[en]];
    }

    getColDef(col: ApplicantColumn): string{
        return `${col.binding}-header`
    }

    getSubcolDef(col: ApplicantColumn, key?: string): string{
        if(col.columnGroup === ApplicantColumnGroup.APPLICANT_RESPONSE || col.columnGroup === ApplicantColumnGroup.APPROVER_RESPONSE){
            return `${col.binding}${key ? '-' + key : ''}-subheader`
        }
        else{
            return col.binding;
        }
    }

    isActiveFilter(col: ApplicantColumn): boolean{
        return this.activeFilter && this.activeFilter.column.columnGroup === col.columnGroup && this.activeFilter.column.binding === col.binding;
    }

    isFilterCol(col: ApplicantColumn, subkey: string = null): boolean{
        let isFilterCol = false;
        let filterIndex = 0;
        while(!isFilterCol && filterIndex < this.filters.length){
            let filter = this.filters[filterIndex];
            if(filter.column.title === col.title){
                if(!subkey){
                    isFilterCol = true;
                }
                else if(filter.subkey && filter.subkey === subkey){
                    isFilterCol = true;
                }
                else{
                    filterIndex++;
                }
            }
            else{
                filterIndex++;
            }
        }
        return isFilterCol;
    }

    isLeftmostCol(column: ApplicantColumn): boolean{
        let index = this.columns.findIndex((col: ApplicantColumn) => {return col.binding === column.binding;});
        return index === 0 || column.columnGroup === ApplicantColumnGroup.APPLICANT_RESPONSE  || column.columnGroup === ApplicantColumnGroup.APPROVER_RESPONSE || this.columns[index - 1].columnGroup !== column.columnGroup;
        
    }

    isSortCol(binding: string, key?: string){
        if(this.sortCol){
            return this.sortCol.binding === binding && (this.sortKey === null || this.sortKey === key);
        }
        else{
            return false;
        }
    }

    killFilterClick(ev: MouseEvent): void{
        ev.stopPropagation();
    }

    listObjectKeys(enumeration: Object): Array<string>{
        return Object.keys(enumeration);
    }

    onCellClick(id: string): void{
        this.userSelected.emit(id);
    }

    onFilter(col: ApplicantColumn, ev: MouseEvent, subkey: string = null): void{
        ev.stopPropagation();
        
        this.filterChanged = false;

        let colAlreadyFiltered = false;
        let filterIndex = 0;
        while(!colAlreadyFiltered && filterIndex < this.filters.length){
            const colToCheck = this.filters[filterIndex].column;
            if(colToCheck.binding === col.binding && colToCheck.columnGroup === col.columnGroup){
                if(!subkey){
                    colAlreadyFiltered = true;
                }
                else if(this.filters[filterIndex].subkey === subkey){
                    colAlreadyFiltered = true;
                }
                else{
                    filterIndex++;
                }
            }
            else{
                filterIndex++;
            }
        }
        this.activeFilter = colAlreadyFiltered ? this.filters[filterIndex] : this.defaultFilter(col, subkey);

        this.positionFilter();

        let resizeFunc = (this.positionFilter).bind(this);
        window.addEventListener('resize', resizeFunc);

        this.filterCloseFunc = function(event: MouseEvent){
            let close = false;
            if(!event || 
               (!((event.target as Element).className as string).includes('mat-calendar') &&
                !((event.target as Element).className as string).includes('cdk-overlay'))
            ) {
                close = true;
                if(this.filterChanged){
                    let empty = this.activeFilter.allowEmpty && this.activeFilter.allowNonEmpty;
                    if(empty){
                        switch(this.activeFilter.column.bindingType){
                            case 0: 
                            case 1: 
                            case 3: empty = this.activeFilter.value === ''; break;
                            case 4: Object.values(this.activeFilter.value).forEach((val) => {if(!val){empty = false;}});break;
                            case 5: empty = this.activeFilter.value.low === 0 && this.activeFilter.value.high === 100; break;
                            case 8: empty = !this.activeFilter.value.before && !this.activeFilter.value.after; break;
                        }
                    }

                    if(empty){
                        if(colAlreadyFiltered){
                            this.filters.splice(filterIndex, 1);
                        }
                    }
                    else{
                        if(colAlreadyFiltered){
                            this.filters[filterIndex] = this.activeFilter;
                        }
                        else {
                            this.filters.push(this.activeFilter);
                        }
                    }

                    this.processMap.delete(this.processId);
                    this.setProcess(this.processId);
                }
            }

            if(close || !this.activeFilter){
                this.activeFilter = null;
                this.filterChanged = false;
                window.removeEventListener('click', this.filterCloseFunc);
                window.removeEventListener('resize', resizeFunc);
                this.cdr.detectChanges();
            }
        }.bind(this);
        window.addEventListener('click', this.filterCloseFunc);
    }

    onFilterDate(subfield: string, event: MatDatepickerInputEvent<Moment>): void{
        this.filterChanged = true;
        this.activeFilter.value[subfield] = event.value.toISOString();
    }
    
    onFilterEnumChange(change: MatSelectionListChange): void{
        let filterKey = this.activeFilter.column.attributes.enumerations[change.option.value];
        this.activeFilter.value[filterKey] = !this.activeFilter.value[filterKey];
        this.filterChanged = true;
    }

    onFilterKeydown(event: KeyboardEvent): void{
        this.filterChanged = true;
        if(event.key === 'Enter'){
            this.onFilterSubmit();
        }
    }

    onFilterSubmit(): void{
        (this.filterCloseFunc as Function)();
    }

    onPage(event: PageEvent): void{
        this.setPage(event.pageIndex, event.pageSize);
    }

    onProcessChange(event: MatSelectChange){
        this.setProcess(event.value);
    }

    onShowClosedChange(): void{
        this.showClosed = !this.showClosed;
        this.requestPage(0, this.pageSize, true);
    }

    openOptions(): void{
        let dialogRef = this.dialog.open(ApplicantTableOptionsModalComponent, { });
        dialogRef.componentInstance.options = this.columns;
        if(this.processId === 'all'){
            dialogRef.componentInstance.process = {
                docId: 'all',
                title: 'All', 
                isLinear: null, 
                default: null, 
                overview: null, 
                steps: null
            }
        }
        else{
            dialogRef.componentInstance.process = this.registrationProcesses.find((reg: Registration) => {return reg.docId === this.processId;});
        }
        dialogRef.componentInstance.newColumns.subscribe((cols: Array<ApplicantColumn>) => {
            cols.forEach((col: ApplicantColumn) => {
                if(col.attributes === null){
                    col.attributes = { };
                }
            });
            this.applicantTableService.updateColumns(cols, this.processId).subscribe((cols) => {
                this.processMap.delete(this.processId);
                this.page = 0;
                this.setProcess(this.processId);
            });
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

    positionFilter(): void{
        let subheaderEl: ElementRef = this.subheaders.find((item: ElementRef) => {return item.nativeElement.id === `subheader-${this.activeFilter.column.binding}`});
        let rect = subheaderEl.nativeElement.getBoundingClientRect();
        if(rect.left + 400 <= document.documentElement.clientWidth){
            this.filterLeft = `${rect.left}px`;
        }
        else{
            this.filterLeft = `${rect.right - 400}px`
        }
        this.filterTop = `${rect.top + rect.height}px`;
    }

    round(num: number): number{
        return Math.round(num);
    }
    
    setPage(page: number, size: number){
        this.page = page;
        this.pageSize = size;
        let start = page * size;
        let end = Math.min(this.pageTotal, start + size);
        if(this.rows.length >= end){
            let allValues = true;
            let index = start;
            while(index < end && allValues){
                allValues = this.rows[index] !== null;
                index++;
            }

            if(allValues){
                this.pagedRows = this.rows.slice(start, end);
            }
            else{
                this.requestPage(page, size, false);
            }
        }
        else{
            this.requestPage(page, size, false);
        }
    }

    setProcess(regId: string){
        if(!this.applicantTableService){return;}

        this.processId = regId;
        if(this.processMap.has(regId)){
            this.displayTable = false;
            this.columns = this.processMap.get(regId).columns;
            this.columnsDef = this.processMap.get(regId).columnsDef;
            this.headerColumnsDef = this.processMap.get(regId).headerColumnsDef;
            this.pageTotal = this.processMap.get(regId).pageTotal;
            this.registrationColumnCount = this.processMap.get(regId).registrationColumnCount;
            this.rows = this.processMap.get(regId).rows;
            this.userColumnCount = this.processMap.get(regId).userColumnCount;
            this.verificationColumnCount = this.processMap.get(regId).verificationColumnCount;
            this.setPage(0, this.pageSize);
            this.displayTable = true;
            this.cdr.detectChanges();
        }
        else{
            this.columnsDef = new Array<string>();
            this.headerColumnsDef = new Array<string>();
            this.registrationColumnCount = 0;
            this.rows = new Array<Object>();
            this.userColumnCount = 0;
            this.verificationColumnCount = 0;

            this.requestPage(0, this.pageSize, true)
            .then((page: Array<ApplicantColumn>) => {
                this.columns = page;
                this.parseColumns();
                this.processMap.set(this.processId, {
                    columns: this.columns,
                    columnsDef: this.columnsDef,
                    headerColumnsDef: this.headerColumnsDef,
                    pageTotal: this.pageTotal,
                    registrationColumnCount: this.registrationColumnCount,
                    rows: this.rows,
                    userColumnCount: this.userColumnCount,
                    verificationColumnCount: this.verificationColumnCount
                });
                this.cdr.detectChanges();
            });
        }
    }

    showAscArrow(binding: string, key?: string): boolean{
        return this.sortAsc && this.showArrow(binding, key);
    }

    showDescArrow(binding: string, key?: string): boolean{
        return !this.sortAsc && this.showArrow(binding, key);
    }

    sort(column: ApplicantColumn, asc: boolean, key?: string): void{
        if(this.rows.length === this.pageTotal){
            if(!this.sortCol || column.binding !== this.sortCol.binding || (key !== undefined && key !== this.sortKey)){
                let sortFunc: (a: Object, b: Object) => number;
                switch(column.bindingType){
                    case ApplicantBindingType.BOOLEAN:
                        sortFunc = (a: Object, b: Object) => {
                            if(a[column.binding] === null){ return b[column.binding] === null ? 0 : 1;}
                            else if(b[column.binding] === null){ return -1;}
                            else{return a[column.binding] && !b[column.binding] ? -1 : !a[column.binding] && b[column.binding] ? 1 : 0;}
                        };
                        break;
                    case ApplicantBindingType.ENUM:
                    case ApplicantBindingType.ICON:
                    case ApplicantBindingType.PROGRESS:
                    case ApplicantBindingType.TEXT:
                        sortFunc = (a: Object, b: Object) => {
                            if(!a.hasOwnProperty(column.binding) || a[column.binding] === null){
                                if(!b.hasOwnProperty(column.binding) || b[column.binding] === null){
                                    return 0;
                                }
                                else{
                                    return 1;
                                }
                            }
                            else if(!b.hasOwnProperty(column.binding) || b[column.binding] === null){
                                return -1;
                            }
                            else{
                                return a[column.binding].toLowerCase() > b[column.binding].toLowerCase() ? 1 :
                                       a[column.binding].toLowerCase() < b[column.binding].toLowerCase() ? -1 : 
                                       0;
                            }
                        };
                        break;
                    case ApplicantBindingType.LIST:
                        sortFunc = (a: Object, b: Object) => {
                            if(a[column.binding] === null){ return b[column.binding] === null ? 0 : 1;}
                            else if(b[column.binding] === null){ return -1;}
                            else if(a[column.binding][key] && !b[column.binding][key]){return -1;}
                            else if(!a[column.binding][key] && b[column.binding][key]){ return 1;}
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
                        break;
                    case ApplicantBindingType.RADIO:
                        break;
                }
                this.rows.sort(sortFunc);
                this.sortCol = column;
                this.sortKey = key;
                this.sortAsc = true;
            }
            else{
                this.rows.reverse();
                this.sortAsc = !this.sortAsc;
            }
            let start = this.page * this.pageSize;
            let end = start + this.pageSize;
            this.pagedRows = this.rows.slice(start, end);
        }
        else{
            if(!this.isSortCol(column.binding, key)){
                this.sortCol = column;
                if(key){this.sortKey = key;}
                else{this.sortKey = null;}
            }
            this.sortAsc = asc;
            this.processMap.delete(this.processId);
            this.setProcess(this.processId);
        }
        (this.filterCloseFunc as Function)();
    }

    sortText(order: string): string{
        switch(this.activeFilter.column.bindingType){
            case 0:
            case 4:
                if(order === 'first'){return 'A';}
                else{return 'Z';}
            case 1:
            case 3:
                if(order === 'first'){return 'True'}
                else{return 'False';}
            case 5:
                if(order === 'first'){return 'Low';}
                else{return 'High';}
            case 8:
                if(order === 'first'){return 'Old';}
                else{return 'New';}
        }
    }

    private defaultFilter(col: ApplicantColumn, subkey: string): ApplicantTableFilter{
        let filter: ApplicantTableFilter = {
            allowEmpty: true,
            allowNonEmpty: true,
            column: col,
            value: ''
        };

        if(col.bindingType === 4){
            filter.value = { };
            let enums: Array<string> = Object.values(col.attributes.enumerations);
            for(let i = 0; i < enums.length; i++){
                filter.value[enums[i]] = true;
            }
        }
        else if(col.bindingType === 5){
            filter.value = {
                high: 100,
                low: 0,
            };
        }
        else if(col.bindingType === 8){
            filter.value = {
                after: '',
                afterOn: false,
                before: '',
                beforeOn: false,
                conjunction: 'AND'
            }
        }

        if(subkey !== null){
            filter.subkey = subkey;
        }

        return filter;
    }

    private requestPage(page: number, perPage: number, countTotal: boolean): Promise<Array<ApplicantColumn>>{
        return new Promise((resolve, reject) => {
            if(!this.applicantTableService){reject();}
            let params: ApplicantTableOptions = {
                countTotal: countTotal,
                page: page,
                perPage: perPage,
                showClosed: this.showClosed,
                orderByDirection: this.sortAsc ? 'ASC' : 'DESC',
            };
            if(this.sortCol){
                params.orderBy = this.sortCol.binding;
                params.orderByGroup = this.sortCol.columnGroup;
                params.orderByType = this.sortCol.bindingType;
                if(this.sortKey){
                    params.orderSubkey = this.sortKey;
                }
            }
            if(this.verifierEmails){
                params.verifierEmails = this.verifierEmails;
            }
            if(this.filters.length > 0){
                params.filters = this.filters;
            }
            this.applicantTableService.populateApplicantTable(this.processId, params).subscribe((pagedResults: PagedApplicantColumnResult) => {
                const newRows = this.populateRows(pagedResults.results);
                const start = page * perPage;
                const end = start + perPage;
                if(pagedResults.total){
                    this.pageTotal = pagedResults.total;
                }
                while(start > this.rows.length){this.rows.push(null);}
                const deleteCount = this.rows.length > end ? perPage : Math.max(this.rows.length - start, 0);
                this.rows.splice(start, deleteCount, ...newRows);
                this.pagedRows = this.rows.slice(start, end);
                this.page = page;
                this.pageSize = perPage;
                this.cdr.detectChanges();
                resolve(pagedResults.results);
            });
        });
    }

    private parseColumns(): void{
        this.headerColumnsDef = new Array<string>();
        this.columnsDef = new Array<string>();
        this.userColumnCount = 0;
        this.registrationColumnCount = 0;
        this.verificationColumnCount = 0;

        this.columns.forEach((column: ApplicantColumn) => {
            switch(column.columnGroup){
                case ApplicantColumnGroup.APPLICANT_RESPONSE: 
                case ApplicantColumnGroup.APPROVER_RESPONSE:
                    this.headerColumnsDef.push(this.getColDef(column));
                    if(column.attributes && column.attributes.listKeys){
                        column.attributes.listKeys.forEach((subCol: string) => {
                            this.columnsDef.push(this.getSubcolDef(column, subCol));
                        });
                    }
                    else{
                        this.columnsDef.push(this.getSubcolDef(column));
                    }
                    break;
                case ApplicantColumnGroup.REGISTRATION_DETAIL:
                    ++this.registrationColumnCount;
                    this.columnsDef.push(column.binding);
                    break;
                case ApplicantColumnGroup.USER_PROFILE:
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
    }

    private populateRows(columns: Array<ApplicantColumn>): Array<Object>{
        let rows = new Array<Object>();

        columns.forEach((column: ApplicantColumn) => {
            if(column.values){
                while(rows.length < column.values.length){
                    rows.push( { } );
                }
                column.values.forEach((value: any, index: number) => {
                    rows[index][column.binding] = value;
                    rows[index]['regId'] = column.registrationIds[index];
                });
            }
        });

        return rows;
    }

    private showArrow(binding: string, key?: string): boolean{
        if(this.sortCol && this.sortCol.binding === binding && (key === undefined || key === this.sortKey)){
            let headerEl = this.subheaders.find((el: ElementRef) => {return el.nativeElement.id === `subheader-${binding}`});
            if(headerEl !== undefined){
                return headerEl.nativeElement.clientWidth >= 75;
            }
        }
        return false;
    }
}