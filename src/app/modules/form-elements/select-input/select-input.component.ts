import { Component, OnInit, Input } from '@angular/core';

import { CustomFormElement } from '../custom-form-element';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss']
})
export class SelectInputComponent extends CustomFormElement implements OnInit {

  @Input() options: Array<Object>;

  constructor() {
    super();
    this.options = [];
  }

  ngOnInit() {
  }

}
