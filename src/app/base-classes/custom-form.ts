import {Output, EventEmitter, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

export abstract class CustomForm {

    form: FormGroup;

    @Input() btnText: string;

    private _allowSave: boolean;
    @Input('allowSave')
    get allowSave(): boolean {
        return this._allowSave;
    }
    set allowSave(allowSave: boolean) {
        this._allowSave = allowSave;
    }

    @Output() formSubmitted: EventEmitter<Object>;
    @Output() formCreated: EventEmitter<void>;

    constructor() {
        this.formSubmitted = new EventEmitter<Object>();
        this.formCreated = new EventEmitter<void>();
        this.btnText = "Save";
        this.allowSave = true;
    }

    protected abstract buildForm(): void;

    clearForm(): void {
        this.form.reset();
    }

    submitForm(obj: Object): void {
        this.formSubmitted.emit(obj);
    }

}