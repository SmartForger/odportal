import { Component, OnInit } from '@angular/core';
import {CustomFormElement} from '../custom-form-element';

@Component({
  selector: 'app-checkbox-input',
  templateUrl: './checkbox-input.component.html',
  styleUrls: ['./checkbox-input.component.scss']
})
export class CheckboxInputComponent extends CustomFormElement implements OnInit {

  constructor() { 
    super();
  }

  ngOnInit() {
  }

}
