import { Component, OnInit, Input } from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {App} from '../../../models/app.model';

@Component({
  selector: 'app-list-apps',
  templateUrl: './list-apps.component.html',
  styleUrls: ['./list-apps.component.scss']
})
export class ListAppsComponent implements OnInit {

  apps: Array<App>;

  @Input() activeUserId: string;

  constructor(private appsSvc: AppsService) { 
    this.apps = new Array<App>();
  }

  ngOnInit() {
    this.listUserApps()
  }

  private listUserApps(): void {
    this.appsSvc.listUserApps(this.activeUserId).subscribe(
      (apps: Array<App>) => {
        this.apps = apps;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
