import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-html-editor',
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.scss']
})
export class HtmlEditorComponent implements OnInit {
  private _value: string = "";

  get value() {
    return this._value;
  }
  @Input("html")
  set value(val: string) {
    this._value = val;
  }

  @Output("htmlChange") change: EventEmitter<string>;

  constructor() {
    this.change = new EventEmitter<string>();
  }

  ngOnInit() {
  }

  reset() {
    this._value = "";
  }
}
