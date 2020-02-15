import { Component, OnInit, Input, Inject, ViewChild, ElementRef } from '@angular/core';
import { Form, Approval, RegistrationSection } from 'src/app/models/form.model';
import { DecimalPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PlatformModalModel } from 'src/app/models/platform-modal.model';

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
        this._parseData();
    }
    private _data: Form;
    @Input() type: 'upload' | 'download';

    @ViewChild('filePicker') filePicker: ElementRef;

    approvals: Array<Approval>;
    filesize: string;
    filetype: string;
    formUploaded: boolean;

    constructor(
        private dlgRef: MatDialogRef<ManualSubmissionModalComponent>,
        @Inject(MAT_DIALOG_DATA) public initData: {data: Form, type: 'upload' | 'download'}
    ) {
        this.type = initData.type;
        this.data = initData.data;
    }

    ngOnInit() { }

    onDownloadForm(): void{
        this.dlgRef.close(null);
    }

    onFileChange(ev): void{
        const file = ev.target.files.item(0);
        this.setFilesizeFromBytes(file.size);
        this.setFiletypeFromMime(file.type);
    }

    onSelectFile(): void{
        this.filePicker.nativeElement.click();
    }

    onUploadForm(): void{
        this.dlgRef.close(this.filePicker.nativeElement.files.item(0));
    }

    private _parseData(): void{
        this.approvals = new Array<Approval>();
        this.filesize = '';
        this.filetype = '';
        this.formUploaded = false;

        this.data.layout.sections.forEach((section: RegistrationSection) => {
            if(section.approval){
                this.approvals.push(section.approval);
            }
        });

        if(this.type === 'download'){
            if(this.data.physicalDownload){
                this.setFiletypeFromMime(this.data.physicalDownload.filetype);
                let filetypeSplit = this.data.physicalDownload.filetype.split('/');
                this.setFilesizeFromBytes(this.data.physicalDownload.filesize);
            }
            else{
                
            }
        }
    }

    private setFilesizeFromBytes(bytes: number): void{
        let format = new Intl.NumberFormat('en-US', {style: 'decimal', maximumFractionDigits: 1});
        let size = bytes;
        if(size / 1000 <= 1){
            this.filesize = `${format.format(size)} bytes`;
        }
        else{
            size = size / 1000;
            if(size / 1000 <= 1){
                this.filesize = `${format.format(size)} kB`;
            }
            else{
                size = size / 1000;
                if(size / 1000 <= 1){
                    this.filesize = `${format.format(size)} MB`;
                }
                else{
                    size = size / 1000;
                    this.filesize = `${format.format(size)} GB`;
                }
            }
        }
    }

    private setFiletypeFromMime(mime: string): void{
        const filetypeSplit = mime.split('/');
        this.filetype = filetypeSplit[filetypeSplit.length - 1].toUpperCase();
    }
}
