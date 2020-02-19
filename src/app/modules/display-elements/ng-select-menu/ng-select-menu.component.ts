import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KeyValue } from 'src/app/models/key-value.model';

@Component({
  selector: 'ng-select-menu',
  templateUrl: './ng-select-menu.component.html',
  styleUrls: ['./ng-select-menu.component.scss']
})
export class NgSelectMenuComponent implements OnInit {
  @Input() options: Array<KeyValue>;
  @Input() value: string;
  @Output() change: EventEmitter<string>;

  constructor() {
    this.options = [];
    this.value = '';
    this.change = new EventEmitter<string>();
  }

  ngOnInit() {
  }

}
