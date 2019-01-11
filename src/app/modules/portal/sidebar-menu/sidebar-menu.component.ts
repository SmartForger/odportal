import { Component, OnInit, OnDestroy } from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {App} from '../../../models/app.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit, OnDestroy {

  apps: Array<App>;
  private appUpdatedSub: Subscription;

  constructor(private appsSvc: AppsService) { 
    this.apps = new Array<App>();
  }

  ngOnInit() {
    this.listUserApps();
    this.subscribeToAppUpdates();
  }

  ngOnDestroy() {
    this.appUpdatedSub.unsubscribe();
  }

  private subscribeToAppUpdates(): void {
    this.appUpdatedSub = this.appsSvc.appSub.subscribe(
      (app: App) => {
        this.listUserApps();
      }
    )
  }

  private listUserApps(): void {
    this.appsSvc.listUserApps('smredman').subscribe(
      (apps: Array<App>) => {
        this.apps = apps;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
