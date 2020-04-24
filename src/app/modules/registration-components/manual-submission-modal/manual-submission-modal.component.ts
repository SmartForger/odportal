import { Component, OnInit, Input, Inject, ViewChild, ElementRef } from '@angular/core';
import { Form, Approval, RegistrationSection } from 'src/app/models/form.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileUtils } from '../../../util/file-utils';

@Component({
    selector: 'app-manual-submission-modal',
    templateUrl: './manual-submission-modal.component.html',
    styleUrls: ['./manual-submission-modal.component.scss']
})
export class ManualSubmissionModalComponent implements OnInit {

    @Input('data')
    get data(): Form{return this._data;}
    set data(data: Form){
        this._data = data;
        this.parseData();
    }
    private _data: Form;
    @Input() type: 'upload' | 'download';

    @ViewChild('filePicker') filePicker: ElementRef;

    approvals: Array<Approval>;
    filename: string;
    filesize: string;
    filetype: string;
    formChosen: boolean;
    formGroup: FormGroup;

    constructor(
        private dlgRef: MatDialogRef<ManualSubmissionModalComponent>,
        @Inject(MAT_DIALOG_DATA) public initData: {data: Form, type: 'upload' | 'download'}
    ) {
        //Type must be set before data.
        this.type = initData.type;
        this.data = initData.data;
    }

    ngOnInit() { }

    onDownloadForm(): void{
        this.dlgRef.close('Confirm Download');
    }

    onFileChange(ev): void{
        const file = ev.target.files.item(0);
        if(file){
            this.filename = FileUtils.isolateFilenameFromExtension(file);
            this.filesize = FileUtils.getFilesizeString(file);
            this.filetype = FileUtils.getFiletypeFromMime(file);
            this.formChosen = true;
        }
        else{
            this.formChosen = false;
        }
    }

    onSelectFile(): void{
        this.filePicker.nativeElement.click();
    }

    onUploadForm(): void{
        this.dlgRef.close(this.filePicker.nativeElement.files.item(0));
    }

    private parseData(): void{
        this.approvals = new Array<Approval>();
        this.filesize = '';
        this.filetype = '';
        this.formChosen = false;
        this.formGroup = new FormGroup({ });

        this.data.layout.sections.forEach((section: RegistrationSection) => {
            if(section.approval){
                this.approvals.push(section.approval);
                this.formGroup.addControl(section.approval.title, new FormControl(false, Validators.requiredTrue));
            }
        });

        if(this.type === 'download'){
            if(this.data.printableForm){
                this.filename = FileUtils.isolateFilenameFromExtension(this.data.printableForm);
                this.filetype = FileUtils.getFiletypeFromMime(this.data.printableForm);
                this.filesize = FileUtils.getFilesizeString(this.data.printableForm);
            }
            else{
                
            }
        }
    }
}
