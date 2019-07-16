import { Component, Output, EventEmitter } from '@angular/core';
import { Widget } from 'src/app/models/widget.model';
import { App } from 'src/app/models/app.model';

@Component({
  selector: 'app-app-picker-modal',
  templateUrl: './app-picker-modal.component.html',
  styleUrls: ['./app-picker-modal.component.scss']
})
export class AppPickerModalComponent {

  get apps(): Array<App>{
    return this._apps;
  }
  set apps(apps: Array<App>){
    this._apps = apps.sort(this.appSort);
  }
  _apps: Array<App>;

  @Output() selectApp: EventEmitter<string>;

  constructor() { 
    this.apps = new Array<App>();
    this.selectApp = new EventEmitter<string>();
  }

  getAppDisplay(app: App): string{
    if(app.version){
      return `${app.appTitle} (v ${app.version})`;
    }
    else{
      return app.appTitle;
    }
  }

  private appSort(a: App, b: App): number{
    if(a.appTitle === b.appTitle){
      if(a.version > b.version){
        return -1;
      }
      else if (a.version < b.version){
        return 1;
      }
      else{
        return 0;
      }
    }
    else if(a.appTitle > b.appTitle){
      return 1;
    }
    else{
      return -1;
    }
  }
}
