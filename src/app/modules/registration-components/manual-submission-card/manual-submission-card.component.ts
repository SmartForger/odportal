import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Form } from 'src/app/models/form.model';

@Component({
    selector: 'app-manual-submission-card',
    templateUrl: './manual-submission-card.component.html',
    styleUrls: ['./manual-submission-card.component.scss']
})
export class ManualSubmissionCardComponent implements OnInit {

    @Input() data: Form;

    @Output() digitalReset: EventEmitter<void>;
    @Output() downloadFormCopy: EventEmitter<void>;
    @Output() downloadPhysicalForm: EventEmitter<void>;
    @Output() manualUpload: EventEmitter<void>;

    constructor() {
        this.digitalReset = new EventEmitter<void>();
        this.downloadFormCopy = new EventEmitter<void>();
        this.downloadPhysicalForm = new EventEmitter<void>();
        this.manualUpload = new EventEmitter<void>();
    }

    ngOnInit() {console.log(this.data);}

    onDigitalReset(): void {
        this.digitalReset.emit();
    }

    onDownloadFormCopy(): void {
        this.downloadFormCopy.emit();
    }

    onManualUpload(): void {
        this.manualUpload.emit();
    }

    onDownloadPhysicalForm(): void {
        this.downloadPhysicalForm.emit();
    }
}
