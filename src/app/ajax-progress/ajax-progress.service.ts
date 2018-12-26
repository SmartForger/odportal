import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AjaxProgressService {

  showSubject: BehaviorSubject<boolean>;

  constructor() { 
    this.showSubject = new BehaviorSubject<boolean>(false);
  }

  show(): void {
    this.showSubject.next(true);
  }

  hide(): void {
    this.showSubject.next(false);
  }


}
