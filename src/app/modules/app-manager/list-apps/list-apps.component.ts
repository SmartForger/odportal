import { Component, OnInit } from '@angular/core';
import {App} from '../../../models/app.model';
import {AppsService} from '../../../services/apps.service';

@Component({
  selector: 'app-list-apps',
  templateUrl: './list-apps.component.html',
  styleUrls: ['./list-apps.component.scss']
})
export class ListAppsComponent implements OnInit {

  apps: Array<App>;

  constructor(private appsSvc: AppsService) { 
    this.apps = new Array<App>();
  }

  ngOnInit() {
    this.listApps();
  }

  private listApps(): void {
    this.appsSvc.listApps().subscribe(
      (apps: Array<App>) => {
        this.apps = apps;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
