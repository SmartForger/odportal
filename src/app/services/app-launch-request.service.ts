/**
 * @description Service that receives requests to launch apps from widgets
 * @author Steven M. Redman
 */

import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {AppLaunchRequest} from '../models/app-launch-request.model';

@Injectable({
  providedIn: 'root'
})
export class AppLaunchRequestService {

  appStates: Map<string, any>;

  constructor(private router: Router) { 
    this.appStates = new Map<string, any>();
  }

  requestLaunch(request: AppLaunchRequest): void {
    this.appStates.set(request.appId, request.data);
    console.log(this.appStates);
    this.router.navigateByUrl(request.launchPath);
  }

}
