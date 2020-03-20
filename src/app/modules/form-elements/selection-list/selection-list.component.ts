import { Component, OnInit, Input, ViewChildren, AfterViewInit, QueryList, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CustomFormElement } from '../custom-form-element';
import { MatSelectionList, MatSelectionListChange, MatListOption, MatList } from '@angular/material';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-selection-list',
    templateUrl: './selection-list.component.html',
    styleUrls: ['./selection-list.component.scss']
})
export class SelectionListComponent extends CustomFormElement implements OnInit, AfterViewInit {
    @Input() checkboxPosition: 'before' | 'after';
    @Input() 
    get colors(): Array<string>{return this._colors;}
    set colors(colors: Array<string>){this.setColors(colors);}
    _colors: Array<string>;
    @Input() 
    get options(): Array<string>{return this._options;}
    set options(options: Array<string>){console.log('receiving new inputs'); console.log(options); this.setOptions(options);}
    private _options: Array<string>;
    @Input() required: boolean;
    @Input()
    get value(): any{return this._value;}
    set value(value: any){this.setValue(value);}
    private _value: any;
    private customValue: boolean;
    private dirtyColors: boolean;
    private viewInit: boolean;

    @ViewChildren(MatListOption) optionComponents: QueryList<MatListOption>;
    
    constructor(private cdr: ChangeDetectorRef) {
        super();
        this.checkboxPosition = 'after';
        this.colors = null;
        this.customValue = false;
        this.dirtyColors = false;
        this.options = new Array<string>();
        this.required = false;
        this.value = null;
        this.viewInit = false;
    }

    ngOnInit() {}

    ngAfterViewInit(){
        this.viewInit = true;
        if(this.dirtyColors){
            this.colorAllValues();
        }
    }

    classList(): string{
        if(this.formGroup && this.formGroup.controls[this.controlName] && this.required){
            if(this.formGroup.controls[this.controlName].disabled){
                return 'disabled';
            }
            else if(this.formGroup.controls[this.controlName].touched && !this.formGroup.controls[this.controlName].valid){
                return 'invalid';
            };
        }
        return '';
    }

    onValueChange(change: MatSelectionListChange): void{
        let option = change.option.getLabel();
        this.value[option] = !this.value[option];

        if(this.required){
            let isAnswered = false;
            this.options.forEach((option) => {
                if(this.value[option] === true){isAnswered = true;}
            });
            this.formGroup.controls[this.controlName].setValue(
                (isAnswered ? this.value : null)
            );
        }
        else{
            this.formGroup.controls[this.controlName].setValue(this.value);
        }
        
        this.color(change.option);
        console.log('onValueChange');
        console.log(this.options);
        console.log(this.value);
    }

    touch(){
        this.formGroup.controls[this.controlName].markAsTouched();
    }

    private color(optionComponent: MatListOption){
        if(this.colors){
            let index = this.options.findIndex((option: string) => option === optionComponent.getLabel());
            if(index >= 0 && index < this.colors.length){
                let color = this.value[optionComponent.getLabel()] ? this.colors[index] : 'none';
                let checkboxEl = optionComponent._getHostElement().firstElementChild.getElementsByTagName('mat-pseudo-checkbox')[0];
                checkboxEl.setAttribute('style', `background: ${color};`);
            }
        }
    }

    private colorAllValues(): void{
        Object.keys(this.value).forEach((option: string) => {
            let optionComponent = this.optionComponents.find((optionComponent: MatListOption) => {
                return optionComponent.getLabel() === option;
            });
            this.color(optionComponent);
        });
    }

    private setColors(colors: Array<string>): void{
        this._colors = colors;
        if(!this.viewInit){
            this.dirtyColors = this.customValue;
        }
        else{
            this.colorAllValues();
        }
    }

    private setOptions(options: Array<string>): void{
        this._options = options;
        if(this.options){
            if(!this.customValue){
                this.value = { };
            }
            console.log(JSON.stringify(this._options));
            this.options.forEach((option: string) => {
                console.log(`option: ${option}`)
                if(!this.value.hasOwnProperty(option)){
                    this.value[option] = false;
                }
            });
            console.log(this.value);
        }
    }

    private setValue(value: any): void{
        if(!value){
            return;
        }
        this._value = value;
        this.customValue = true;
        if(!this.viewInit){
            this.dirtyColors = this.colors !== null;
        }
        else{
            this._value = value;
            this.colorAllValues();
        }
        
    }
}