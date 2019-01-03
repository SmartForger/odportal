import {Input, Output, EventEmitter} from '@angular/core';
import * as uuid from 'uuid';

export abstract class BindInputElement {

    @Input() label: string;
    @Input() labelDesc: string;
    @Input() placeholder: string;
    @Input() readonly: boolean;

    protected _value: any;

    @Input()
    get value(): any {
        return this._value;
    }
    set value(val: any) {
        this._value = val;
        this.valueChange.emit(this._value);
    }

    @Output() valueChange: EventEmitter<any>;

    id: string;

    constructor() {
        this.label = "";
        this.labelDesc = "";
        this.placeholder = "";
        this.readonly = false;
        this.valueChange = new EventEmitter<any>();
        this.id = uuid.v4();
    }

}