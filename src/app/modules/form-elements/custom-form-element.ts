import {Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import * as uuid from 'uuid';

export abstract class CustomFormElement {

    @Input() label: string;
    @Input() labelDesc: string;
    @Input() formGroupClassList: string;
    @Input() inputClassList: string;
    @Input() placeholder: string;
    @Input() maxChars: number;
    @Input() errorMsg: string;
    @Input() errorMsgClassList: string;
    
    @Input() formGroup: FormGroup;
    @Input() controlName: string;

    id: string;

    constructor() {
        this.label = "";
        this.formGroupClassList = "";
        this.inputClassList = "";
        this.placeholder = "";
        this.maxChars = 250;
        this.errorMsg = "";
        this.errorMsgClassList = "alert-danger";
        this.id = uuid.v4();
    }

}