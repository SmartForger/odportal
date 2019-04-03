/**
 * @description Service facilitating components to add a widget to the windowing system.
 * @author James Marcu
 */

import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { AppWithWidget } from '../models/app-with-widget.model';

@Injectable({
  providedIn: 'root'
})
export class WidgetWindowsService {

  private addWindowSub: Subject<AppWithWidget>;
  private removeAppWindowsSub: Subject<string>;

  constructor(){
    this.addWindowSub = new Subject<AppWithWidget>();
    this.removeAppWindowsSub = new Subject<string>();
  }

  addWindow(ap: AppWithWidget): void {
    this.addWindowSub.next(ap);
  }

  removeAppWindows(appId: string): void {
    this.removeAppWindowsSub.next(appId);
  }

  observeAddWindow(): Observable<AppWithWidget> {
    return this.addWindowSub.asObservable();
  }

  observeAppWindowRemoval(): Observable<string> {
    return this.removeAppWindowsSub.asObservable();
  }
}
