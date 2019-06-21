import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { CustomFormElement } from '../custom-form-element';
import { KeyValue } from '../../../models/key-value.model';
import { MatRadioButton } from '@angular/material';

@Component({
  selector: 'app-radio-input',
  templateUrl: './radio-input.component.html',
  styleUrls: ['./radio-input.component.scss']
})
export class RadioInputComponent extends CustomFormElement implements OnInit {
  @Input() options: Array<KeyValue> = [];

  @ViewChildren(MatRadioButton) radioButtons: QueryList<MatRadioButton>;

  constructor() {
    super();
  }

  ngOnInit() { }

  getSelected(): MatRadioButton{
    if(this.value && this.radioButtons){
      try{
        return this.radioButtons.find((item: MatRadioButton) => {
          if(item.value){
            return item.value === this.value;
          }  
        });
      }
      catch(err){
        console.error(err);
        return null;
      }
    }
    else{
      return null;
    }
  }

}
