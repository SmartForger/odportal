import { Component, Input, ViewChild } from '@angular/core';
import {  MatDatepickerInputEvent } from '@angular/material';
import { CustomFormElement } from '../custom-form-element';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-datepicker-input',
    templateUrl: './datepicker-input.component.html',
    styleUrls: ['./datepicker-input.component.scss']
})
export class DatepickerInputComponent extends CustomFormElement {

    @Input('format') 
    get format(): string{return this._format;}
    set format(format: string){if(format){this._format = format;}}
    private _format: string;

    constructor() {
        super();
        this.format = 'MM/DD/YYYY';
    }

    onDateChange(event: MatDatepickerInputEvent<Date>){
        try{
            this.formGroup.controls[this.controlName].setValue(moment(event.value.toISOString()).format(this.format));
            this.emitValueChange();
        }
        catch(err){
            console.log(err);
        }
    }

}
