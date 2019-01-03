import { Component, OnInit } from '@angular/core';
import {BindInputElement} from '../bind-input-element';

@Component({
  selector: 'app-bind-checkbox-input',
  templateUrl: './bind-checkbox-input.component.html',
  styleUrls: ['./bind-checkbox-input.component.scss']
})
export class BindCheckboxInputComponent extends BindInputElement implements OnInit {

  constructor() { 
    super();
  }

  ngOnInit() {
  }

}
