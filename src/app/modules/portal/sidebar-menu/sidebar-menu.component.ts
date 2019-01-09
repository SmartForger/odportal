import { Component, OnInit } from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {App} from '../../../models/app.model';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {

  apps: Array<App>;

  constructor(private appsSvc: AppsService) { 
    this.apps = new Array<App>();
  }

  ngOnInit() {
    this.listUserApps();
  }

  private listUserApps(): void {
    this.appsSvc.listUserApps('smredman').subscribe(
      (apps: Array<App>) => {
        this.apps = apps;
        console.log(this.apps);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
