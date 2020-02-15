import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Form } from 'src/app/models/form.model';

@Component({
    selector: 'app-manual-submission-card',
    templateUrl: './manual-submission-card.component.html',
    styleUrls: ['./manual-submission-card.component.scss']
})
export class ManualSubmissionCardComponent implements OnInit {

    @Input() data: Form;

    @Output() downloadFormCopy: EventEmitter<void>;
    @Output() manualUpload: EventEmitter<void>;

    constructor() {
        this.downloadFormCopy = new EventEmitter<void>();
        this.manualUpload = new EventEmitter<void>();
    }

    ngOnInit() { }

    onDownloadFormCopy(): void {
        this.downloadFormCopy.emit();
    }

    onManualUpload(): void {
        this.manualUpload.emit();
    }
}
