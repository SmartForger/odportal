import { Component, OnInit, Input } from '@angular/core';
import {CustomFormElement} from '../custom-form-element';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent extends CustomFormElement implements OnInit {

  @Input() type: string;

  constructor() { 
    super();
  }

  ngOnInit() {
  }

}
