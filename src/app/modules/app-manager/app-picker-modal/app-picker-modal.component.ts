import { Component, Output, EventEmitter } from '@angular/core';
import { App } from 'src/app/models/app.model';

@Component({
  selector: 'app-app-picker-modal',
  templateUrl: './app-picker-modal.component.html',
  styleUrls: ['./app-picker-modal.component.scss']
})
export class AppPickerModalComponent {

  apps: Array<App>;

  @Output() selectApp: EventEmitter<string>;

  constructor() { 
    this.apps = new Array<App>();
    this.selectApp = new EventEmitter<string>();
  }

}
