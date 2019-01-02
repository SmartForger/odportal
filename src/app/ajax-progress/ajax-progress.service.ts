import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AjaxProgressService {

  showSubject: BehaviorSubject<boolean>;
  
  private _show: boolean;
  get show(): boolean {
    return this._show;
  }
  set show(show: boolean) {
    this._show = show;
    this.showSubject.next(show);
  }

  constructor() { 
    this.showSubject = new BehaviorSubject<boolean>(false);
    this.show = false;
  }

}
