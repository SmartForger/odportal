import { Component, OnInit } from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {App} from '../../../models/app.model';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  apps: Array<App>;

  constructor(private appsSvc: AppsService, private authSvc: AuthService) { 
    this.apps = new Array<App>();
  }

  ngOnInit() {
    this.listUserApps();
  }

  private listUserApps(): void {
    this.appsSvc.listUserApps(this.authSvc.getUserId()).subscribe(
      (apps: Array<App>) => {
        this.apps = apps;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
