import { Component, OnInit, Input } from '@angular/core';
import {BindInputElement} from '../bind-input-element';
import {KeyValue} from '../../../models/key-value.model';

@Component({
  selector: 'app-bind-select-input',
  templateUrl: './bind-select-input.component.html',
  styleUrls: ['./bind-select-input.component.scss']
})
export class BindSelectInputComponent extends BindInputElement implements OnInit {

  @Input() dropdownOptions: Array<KeyValue>;

  constructor() { 
    super();
    this.dropdownOptions = new Array<KeyValue>();
  }

  ngOnInit() {
  }

}
