/**
 * @description Retrieves and emits user-specific settings for the platform, including show/hiding the navigation, selected skin, etc.
 * @author Steven M. Redman
 */

import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {

  private showNavSubject: BehaviorSubject<boolean>;

  constructor() { 
    this.showNavSubject = new BehaviorSubject<boolean>(true);
  }

  setShowNavigation(show: boolean): void {
    this.showNavSubject.next(show);
  }

  observeShowNavigationUpdated(): Observable<boolean> {
    return this.showNavSubject.asObservable();
  }
}
