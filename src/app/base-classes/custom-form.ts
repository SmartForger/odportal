import {Output, EventEmitter, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

export abstract class CustomForm {

    form: FormGroup;

    @Input() btnText: string;

    @Output() formSubmitted: EventEmitter<Object>;

    constructor() {
        this.formSubmitted = new EventEmitter<Object>();
        this.btnText = "Save";
    }

    protected abstract buildForm(): void;

    clearForm(): void {
        this.form.reset();
    }

    submitForm(obj: Object): void {
        this.formSubmitted.emit(obj);
    }

}