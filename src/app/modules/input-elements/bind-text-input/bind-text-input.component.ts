import { Component, OnInit, Input } from '@angular/core';
import {BindInputElement} from '../bind-input-element';

@Component({
  selector: 'app-bind-text-input',
  templateUrl: './bind-text-input.component.html',
  styleUrls: ['./bind-text-input.component.scss']
})
export class BindTextInputComponent extends BindInputElement<string> implements OnInit {

  @Input() type: string;

  constructor() { 
    super();
    this.type = 'text';
  }

  ngOnInit() {
  }

}
