import { Component, OnInit, Input } from '@angular/core';
import { CustomFormElement } from '../custom-form-element';
import { KeyValue } from '../../../models/key-value.model';

@Component({
  selector: 'app-radio-input',
  templateUrl: './radio-input.component.html',
  styleUrls: ['./radio-input.component.scss']
})
export class RadioInputComponent extends CustomFormElement implements OnInit {
  @Input() options: Array<KeyValue> = [];

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
