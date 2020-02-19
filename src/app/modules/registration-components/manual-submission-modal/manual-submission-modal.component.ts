import { Component, OnInit, Input, Inject, ViewChild, ElementRef } from '@angular/core';
import { Form, Approval, RegistrationSection } from 'src/app/models/form.model';
import { DecimalPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PlatformModalModel } from 'src/app/models/platform-modal.model';
import { FormGroup, AbstractControl, FormControl, Validators } from '@angular/forms';

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
        this.data = initData.data;
        this.type = initData.type;
    }

    ngOnInit() { }

    onDownloadForm(): void{
        this.dlgRef.close(null);
    }

    onFileChange(ev): void{
        console.log('file change event: ...');
        console.log(ev);
        const file = ev.target.files.item(0);
        if(file){
            console.log('file: ...');
            console.log(file);
            this.setFilenameFromName(file.name);
            this.setFilesizeFromBytes(file.size);
            this.setFiletypeFromMime(file.type);
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
            if(this.data.physicalDownload){
                this.setFiletypeFromMime(this.data.physicalDownload.filetype);
                let filetypeSplit = this.data.physicalDownload.filetype.split('/');
                this.setFilesizeFromBytes(this.data.physicalDownload.filesize);
            }
            else{
                
            }
        }
    }

    private setFilenameFromName(name: string): void{
        let split = name.split('.');
        if(split.length > 1){
            split.splice(split.length - 1, 1);
        }
        this.filename = split.join('');
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
        console.log(`filesize: ${this.filesize}`)
    }

    private setFiletypeFromMime(mime: string): void{
        const filetypeSplit = mime.split('/');
        this.filetype = filetypeSplit[filetypeSplit.length - 1].toUpperCase();
        console.log(`filetype: ${this.filetype}`)
    }
}
