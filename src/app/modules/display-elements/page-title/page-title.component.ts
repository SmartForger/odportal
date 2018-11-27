import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Breadcrumb} from '../breadcrumb.model';
import {ButtonElement} from '../button-element.model';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent implements OnInit {

  @Input() pageTitle: string;
  @Input() crumbs: Array<Breadcrumb>;
  @Input() buttons: Array<ButtonElement>;

  @Output() btnClicked: EventEmitter<string>;

  constructor() { 
    this.pageTitle = "";
    this.crumbs = new Array<Breadcrumb>();
    this.buttons = new Array<ButtonElement>();
    this.btnClicked = new EventEmitter<string>();
  }

  ngOnInit() {
  }

  buttonClicked(btnName: string): void {
    this.btnClicked.emit(btnName.toLowerCase());
  }

}
