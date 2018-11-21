import { Component, OnInit, Input } from '@angular/core';

import { CustomFormElement } from '../custom-form-element';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss']
})
export class NumberInputComponent extends CustomFormElement implements OnInit {

  @Input() maxValue: number;
  @Input() minValue: number;

  constructor() {
    super();
    this.maxValue = 256;
    this.minValue = 0;
  }

  ngOnInit() {
  }

}
