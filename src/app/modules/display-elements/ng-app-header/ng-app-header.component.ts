import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { KeyValue } from 'src/app/models/key-value.model';

@Component({
  selector: 'ng-app-header',
  templateUrl: './ng-app-header.component.html',
  styleUrls: ['./ng-app-header.component.scss']
})
export class NgAppHeaderComponent implements OnInit {
  @Input() title: string;
  @Input() options: Array<KeyValue>;
  @Input() currentOption: string;
  @Input() menuOptions: Array<KeyValue>;
  @Output() back: EventEmitter<any>;
  @Output() menuClick: EventEmitter<string>;
  @Output() optionChange: EventEmitter<string>;

  constructor() {
    this.title = "";
    this.options = [];
    this.currentOption = "";
    this.menuOptions = [];
    this.back = new EventEmitter<any>();
    this.menuClick = new EventEmitter<string>();
    this.optionChange = new EventEmitter<string>();
  }

  ngOnInit() {
  }

}
