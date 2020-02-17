import { Component, OnInit, Input } from '@angular/core';

import { CustomFormElement } from '../custom-form-element';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent extends CustomFormElement implements OnInit {

  @Input() type: string;
  @Input() icon: string;

  constructor() {
    super();

    this.type = 'text';
    this.icon = null;
  }

  ngOnInit() {
  }

  classList(): string{
    return `${this.fullWidth ? 'full-width-input ' : ''}${this.formGroupClassList}`
  }
}
