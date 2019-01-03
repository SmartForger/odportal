import {Input, Output, EventEmitter} from '@angular/core';
import * as uuid from 'uuid';

export abstract class BindInputElement<T> {

    @Input() label: string;
    @Input() labelDesc: string;
    @Input() placeholder: string;
    @Input() readonly: boolean;

    protected _value: T;

    @Input()
    get value(): T {
        return this._value;
    }
    set value(val: T) {
        this._value = val;
        this.valueChange.emit(this._value);
    }

    @Output() valueChange: EventEmitter<T>;

    id: string;

    constructor() {
        this.label = "";
        this.labelDesc = "";
        this.placeholder = "";
        this.readonly = false;
        this.valueChange = new EventEmitter<T>();
        this.id = uuid.v4();
    }

}