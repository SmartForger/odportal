import {Input, Output, EventEmitter} from '@angular/core';
import {FormGroup} from '@angular/forms';

export abstract class CustomForm {

    form: FormGroup;

    protected formSubmitted: EventEmitter<Object>;

    constructor() {
        this.formSubmitted = new EventEmitter<Object>();
    }

    protected abstract buildForm(): void;

    clearForm(): void {
        this.form.reset();
    }

    submitForm(obj: Object): void {
        this.formSubmitted.emit(obj);
    }

}