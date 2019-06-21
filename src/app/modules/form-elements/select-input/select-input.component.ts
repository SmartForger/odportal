import { Component, Input, OnInit } from '@angular/core';
import { CustomFormElement } from '../custom-form-element';
import { KeyValue } from 'src/app/models/key-value.model';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss']
})
export class SelectInputComponent extends CustomFormElement implements OnInit {
  @Input() options: Array<KeyValue>;

  constructor() { 
    super();
  }

  ngOnInit() {
  }

}
