import {Output, EventEmitter} from '@angular/core';
import {FormGroup} from '@angular/forms';

export abstract class CustomForm {

    form: FormGroup;

    @Output() formSubmitted: EventEmitter<Object>;
    @Output() formCreated: EventEmitter<void>;

    constructor() {
        this.formSubmitted = new EventEmitter<Object>();
        this.formCreated = new EventEmitter<void>();
    }

    protected abstract buildForm(): void;

    clearForm(): void {
        this.form.reset();
    }

    submitForm(obj: Object): void {
        this.formSubmitted.emit(obj);
    }

}