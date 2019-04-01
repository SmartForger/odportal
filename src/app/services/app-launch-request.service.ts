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

  //Only one appState is required because only one app is open at a time
  appState: any;

  constructor(private router: Router) { }

  requestLaunch(request: AppLaunchRequest): void {
    this.appState = request.data;
    this.router.navigateByUrl(request.launchPath);
  }

}
