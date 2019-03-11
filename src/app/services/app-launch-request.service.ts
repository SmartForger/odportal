import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {AppLaunchRequest} from '../models/app-launch-request.model';

@Injectable({
  providedIn: 'root'
})
export class AppLaunchRequestService {

  appState: any;

  constructor(private router: Router) { }

  requestLaunch(request: AppLaunchRequest): void {
    this.appState = request.data;
    this.router.navigateByUrl(request.launchPath);
  }

}
