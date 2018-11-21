import { Component, OnInit, Input } from '@angular/core';

import { CustomFormElement } from '../custom-form-element';

@Component({
  selector: 'app-textarea-input',
  templateUrl: './textarea-input.component.html',
  styleUrls: ['./textarea-input.component.scss']
})
export class TextareaInputComponent extends CustomFormElement implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
