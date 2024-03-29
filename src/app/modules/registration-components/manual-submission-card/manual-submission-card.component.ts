import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Form } from 'src/app/models/form.model';
import { RegistrationUserType } from 'src/app/models/registration.model';

@Component({
    selector: 'app-manual-submission-card',
    templateUrl: './manual-submission-card.component.html',
    styleUrls: ['./manual-submission-card.component.scss']
})
export class ManualSubmissionCardComponent implements OnInit {

    @Input() userType: RegistrationUserType;
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

    ngOnInit() {}

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

    show(): boolean{
        return this.data && this.userType && this.data.allowPhysicalUpload[this.userType];
    }
}
