import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AjaxProgressService {

  showSubject: BehaviorSubject<boolean>;
  private whiteList: RegExp;
  isShown = false;

  constructor() {
    this.showSubject = new BehaviorSubject<boolean>(false);
    this.isShown = false;
    const whiteList: Array<string> = new Array<string>(
      "realm\/.+\/user\/[A-Z]+",
      "(comments)"
    );
    this.whiteList = new RegExp(whiteList.join("|"), "i");
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

  private showHide(show: boolean): void {
    this.isShown = show;
    this.showSubject.next(show);
  }

}
