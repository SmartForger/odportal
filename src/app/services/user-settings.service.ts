import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {

  showNavSubject: BehaviorSubject<boolean>;

  constructor() { 
    this.showNavSubject = new BehaviorSubject<boolean>(true);
  }

  setShowNavigation(show: boolean): void {
    this.showNavSubject.next(show);
  }
}
