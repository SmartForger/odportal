/**
 * @description Service that emits a boolean to show/hide the AJAX progress indicator.
 * @author Steven M. Redman
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { GlobalConfig } from '../models/global-config.model';

@Injectable({
  providedIn: 'root'
})
export class AjaxProgressService {

  private forceZeroSub: Subject<void>;
  private showSubject: BehaviorSubject<boolean>;
  private routes: Set<string>;
  private whiteList: RegExp;
  isShown = false;

  constructor(private authSvc: AuthService) {
    this.showSubject = new BehaviorSubject<boolean>(false);
    this.isShown = false;
    this.routes = new Set<string>();
    this.routes.add("realm\/.+\/user\/[A-Za-z0-9]+"),
    this.routes.add("(comments)");
    this.routes.add("feedback-service\/api\/v[0-9]+\/widgets\/realm\/my-realm")
    this.whiteList = new RegExp(Array.from(this.routes).join('|'), 'i');
    this.authSvc.observeGlobalConfigUpdates().subscribe((config: GlobalConfig) => {
        if(config !== null){
            if(config.speedtestServiceConnection){
                this.routes.add(config.speedtestServiceConnection);
            }
            this.whiteList = new RegExp(Array.from(this.routes).join('|'), 'i');
        }
    });
    this.forceZeroSub = new Subject<void>();
  }

  show(route: string): void {
    if (!this.whiteList.test(route)) {
      this.showHide(true);
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

  subscribeToForceZeroRequests(): Observable<void>{
    return this.forceZeroSub.asObservable();
  }

  forceZeroRequests(): void{
    this.forceZeroSub.next();
  }

  private showHide(show: boolean): void {
    this.isShown = show;
    this.showSubject.next(show);
  }

  private escapeString(str: string){
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
  }
}
