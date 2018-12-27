import {Input, Output, EventEmitter} from '@angular/core';

export abstract class FilterBase<T> {

    search: string;

    @Input() labelText: string;
    @Input() placeholderText: string;

    @Output() protected searchUpdated: EventEmitter<T>;

    constructor() {
        this.labelText = "";
        this.placeholderText = "";
        this.search = "";
        this.searchUpdated = new EventEmitter<T>();
    }

    abstract submitSearch(): void;

}