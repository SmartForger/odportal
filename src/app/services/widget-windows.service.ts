import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { App } from '../models/app.model';
import { Widget } from '../models/widget.model';

@Injectable({
  providedIn: 'root'
})
export class WidgetWindowsService {

  addWindowSub: Subject<{app: App, widget: Widget}>;
  removeAppWindowsSub: Subject<string>;

  constructor(){
    this.addWindowSub = new Subject();
    this.removeAppWindowsSub = new Subject<string>();
  }
}
