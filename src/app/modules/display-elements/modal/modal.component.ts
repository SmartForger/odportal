import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {ButtonElement} from '../button-element.model';

// import {MDCDialog} from '@material/dialog';
// const dialog = new MDCDialog(document.querySelector('.mdc-dialog'));

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;
  @Input() iconClassList: string;
  @Input() buttons: Array<ButtonElement>;

  private _show: boolean;
  @Input('show')
  get show(): boolean {
    return this._show;
  }
  set show(show: boolean) {
    this._show = show;
  }

  @Output() btnClicked: EventEmitter<string>;
  
  constructor() { 
    this.title = "";
    this.message = "";
    this.show = false;
    this.buttons = new Array<ButtonElement>();
    this.btnClicked = new EventEmitter<string>();
  }

  ngOnInit() {
  }

  buttonClicked(btnName: string): void {
    this.btnClicked.emit(btnName.toLowerCase());
  }

}
