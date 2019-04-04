import { Component, Output, EventEmitter } from '@angular/core';
import { ButtonElement } from '../button-element.model';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {

  title: string;
  icons: Array<{icon: string, classList: string}>
  message: string;
  buttons: Array<ButtonElement>;
  callback: Function;

  @Output() btnClick: EventEmitter<string>;

  constructor() {
    this.title = '';
    this.icons = [];
    this.message = "";
    this.buttons = [];
    this.btnClick = new EventEmitter();
  }

}
