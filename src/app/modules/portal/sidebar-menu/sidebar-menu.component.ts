import { Component, OnInit } from '@angular/core';
import {AppsService} from '../../../services/apps.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {

  constructor(private appsSvc: AppsService) { }

  ngOnInit() {
    //this.listUserApps();
  }

  private listUserApps(): void {
    this.appsSvc.listUserApps('smredman').subscribe(
      (results: any) => {
        console.log(results);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
