/**
 * @description Service that emits a boolean to show/hide the AJAX progress indicator.
 * @author Steven M. Redman
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AjaxProgressService {

  private showSubject: BehaviorSubject<boolean>;
  private routes: Set<string>;
  private whiteList: RegExp;
  isShown = false;

  constructor() {
    this.showSubject = new BehaviorSubject<boolean>(false);
    this.isShown = false;
    this.routes = new Set<string>();
    this.routes.add("realm\/.+\/user\/[A-Za-z0-9]+"),
    this.routes.add("(comments)");
    this.whiteList = new RegExp(Array.from(this.routes).join('|'), 'i');
  }

  show(route: string): void {
    if (!this.whiteList.test(route)) {
      this.showHide(true);
    }
    else {
      console.log(route + ": was whitelisted");
    }
  }

  hide(): void {
    this.showHide(false);
  }

  observeShowProgress(): Observable<boolean> {
    return this.showSubject.asObservable();
  }

  whitelistRoute(route: string){
    this.routes.add(this.escapeString(route));
    this.whiteList = new RegExp(Array.from(this.routes).join('|'), 'i');
  }

  private showHide(show: boolean): void {
    this.isShown = show;
    this.showSubject.next(show);
  }

  private escapeString(str: string){
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
  }
}
