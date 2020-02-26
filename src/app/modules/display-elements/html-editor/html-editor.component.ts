import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-html-editor',
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.scss']
})
export class HtmlEditorComponent implements OnInit {

  @Input() html: string;
  @Output("htmlChange") change: EventEmitter<string>;

  constructor() {
    this.change = new EventEmitter<string>();
  }

  ngOnInit() {
  }

  reset() {
    this.html = "";
  }
}
